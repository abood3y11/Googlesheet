import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Fade,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { projectsAPI } from '../services/api';

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    project_name: '',
    beneficiary_organization: '',
    university_project_manager: '',
    technical_responsible_beneficiary: '',
    university_project_team: '',
    executing_company_name: '',
    executing_company_project_manager: '',
    executing_company_representative: '',
    authorization_number: '',
    project_authorization_date: null,
    project_cost: '',
    purchase_order_number: '',
    charter_preparation_date: null,
    project_start_date: null,
    type_of_project_start: 'contract_signing',
    project_duration_days: '',
    planned_project_end_date: null,
    site_handover_date: null,
    contract_signing_date: null,
    project_status: 'planning',
    project_suspension_date: null,
    suspension_duration: '',
    project_resumption_date: null,
    notes: '',
    // New fields for authorization data
    authorization_data: {
      authorization_number: '',
      authorization_date: null,
      notes: ''
    },
    // New field for licenses
    licenses: []
  });

  const steps = [
    { label: 'المعلومات الأساسية', icon: <AssignmentIcon /> },
    { label: 'الفرق والمسؤوليات', icon: <PersonIcon /> },
    { label: 'بيانات التعميد', icon: <SecurityIcon /> },
    { label: 'المعلومات المالية', icon: <MoneyIcon /> },
    { label: 'الجدول الزمني', icon: <ScheduleIcon /> },
    { label: 'بيانات الرخص', icon: <DescriptionIcon /> },
  ];

  // University project managers validation list
  const universityProjectManagers = [
    'محمد الشهري',
    'نجلاء الحميد',
    'نوف الفارس',
    'يوسف العنزي',
    'سارة المقرن',
    'عمار القحطاني'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

  // Calculate planned end date when start date or duration changes
  useEffect(() => {
    if (formData.project_start_date && formData.project_duration_days) {
      const startDate = dayjs(formData.project_start_date);
      const endDate = startDate.add(parseInt(formData.project_duration_days), 'day');
      setFormData(prev => ({
        ...prev,
        planned_project_end_date: endDate
      }));
    }
  }, [formData.project_start_date, formData.project_duration_days]);

  // Calculate duration when start date and end date change
  useEffect(() => {
    if (formData.project_start_date && formData.planned_project_end_date) {
      const startDate = dayjs(formData.project_start_date);
      const endDate = dayjs(formData.planned_project_end_date);
      const duration = endDate.diff(startDate, 'day');
      if (duration > 0 && duration !== parseInt(formData.project_duration_days)) {
        setFormData(prev => ({
          ...prev,
          project_duration_days: duration.toString()
        }));
      }
    }
  }, [formData.project_start_date, formData.planned_project_end_date]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const project = await projectsAPI.getProjectById(id);
      
      const formattedProject = { ...project };
      const dateFields = [
        'project_authorization_date',
        'charter_preparation_date',
        'project_start_date',
        'planned_project_end_date',
        'site_handover_date',
        'contract_signing_date',
        'project_suspension_date',
        'project_resumption_date',
      ];
      
      dateFields.forEach(field => {
        if (formattedProject[field]) {
          formattedProject[field] = dayjs(formattedProject[field]);
        }
      });

      // Handle authorization data
      if (!formattedProject.authorization_data) {
        formattedProject.authorization_data = {
          authorization_number: '',
          authorization_date: null,
          notes: ''
        };
      } else if (formattedProject.authorization_data.authorization_date) {
        formattedProject.authorization_data.authorization_date = dayjs(formattedProject.authorization_data.authorization_date);
      }

      // Handle licenses
      if (!formattedProject.licenses) {
        formattedProject.licenses = [];
      } else {
        formattedProject.licenses = formattedProject.licenses.map(license => ({
          ...license,
          start_date: license.start_date ? dayjs(license.start_date) : null,
          end_date: license.end_date ? dayjs(license.end_date) : null
        }));
      }
      
      setFormData(formattedProject);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAuthorizationDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      authorization_data: {
        ...prev.authorization_data,
        [field]: value
      }
    }));
  };

  const addLicense = () => {
    const newLicense = {
      id: Date.now(), // Temporary ID for new licenses
      license_number: '',
      license_name: '',
      start_date: null,
      end_date: null,
      notes: ''
    };
    
    setFormData(prev => ({
      ...prev,
      licenses: [...prev.licenses, newLicense]
    }));
  };

  const removeLicense = (index) => {
    setFormData(prev => ({
      ...prev,
      licenses: prev.licenses.filter((_, i) => i !== index)
    }));
  };

  const handleLicenseChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      licenses: prev.licenses.map((license, i) => 
        i === index ? { ...license, [field]: value } : license
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const submitData = { ...formData };
      const dateFields = [
        'project_authorization_date',
        'charter_preparation_date',
        'project_start_date',
        'planned_project_end_date',
        'site_handover_date',
        'contract_signing_date',
        'project_suspension_date',
        'project_resumption_date',
      ];
      
      dateFields.forEach(field => {
        if (submitData[field] && dayjs.isDayjs(submitData[field])) {
          submitData[field] = submitData[field].format('YYYY-MM-DD');
        }
      });

      // Handle authorization data dates
      if (submitData.authorization_data.authorization_date && dayjs.isDayjs(submitData.authorization_data.authorization_date)) {
        submitData.authorization_data.authorization_date = submitData.authorization_data.authorization_date.format('YYYY-MM-DD');
      }

      // Handle license dates
      submitData.licenses = submitData.licenses.map(license => ({
        ...license,
        start_date: license.start_date && dayjs.isDayjs(license.start_date) ? license.start_date.format('YYYY-MM-DD') : license.start_date,
        end_date: license.end_date && dayjs.isDayjs(license.end_date) ? license.end_date.format('YYYY-MM-DD') : license.end_date
      }));

      if (submitData.project_cost) {
        submitData.project_cost = parseFloat(submitData.project_cost);
      }
      if (submitData.project_duration_days) {
        submitData.project_duration_days = parseInt(submitData.project_duration_days);
      }
      if (submitData.suspension_duration) {
        submitData.suspension_duration = parseInt(submitData.suspension_duration);
      }

      if (isEdit) {
        await projectsAPI.updateProject(id, submitData);
      } else {
        await projectsAPI.createProject(submitData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const projectStatuses = [
    { value: 'planning', label: 'تخطيط', color: '#3b82f6' },
    { value: 'in_progress', label: 'قيد التنفيذ', color: '#10b981' },
    { value: 'suspended', label: 'متوقف', color: '#f59e0b' },
    { value: 'completed', label: 'مكتمل', color: '#8b5cf6' },
    { value: 'cancelled', label: 'ملغي', color: '#ef4444' },
  ];

  const projectStartTypes = [
    { value: 'contract_signing', label: 'من توقيع العقد' },
    { value: 'authorization', label: 'من التعميد' },
    { value: 'site_handover', label: 'من استلام الموقع' },
  ];

  // Common styles for all form fields
  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: '56px',
      fontFamily: 'Sakkal Majalla',
      fontSize: '1rem',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: 'primary.main',
      }
    },
    '& .MuiInputLabel-root': {
      fontFamily: 'Sakkal Majalla',
      fontSize: '1rem',
      fontWeight: 500,
      '&.Mui-focused': {
        color: 'primary.main',
        fontWeight: 600
      }
    },
    '& .MuiSelect-select': {
      fontFamily: 'Sakkal Majalla',
      fontSize: '1rem'
    }
  };

  const textAreaStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      fontFamily: 'Sakkal Majalla',
      fontSize: '1rem',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: 'primary.main',
      }
    },
    '& .MuiInputLabel-root': {
      fontFamily: 'Sakkal Majalla',
      fontSize: '1rem',
      fontWeight: 500,
      '&.Mui-focused': {
        color: 'primary.main',
        fontWeight: 600
      }
    }
  };

  const FormSection = ({ title, icon, children, step, gradient }) => (
    <Collapse in={activeStep === step} timeout={500}>
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        mb: 4
      }}>
        <Box sx={{
          background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              width: 48,
              height: 48
            }}>
              {icon}
            </Avatar>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 4 }}>
          {children}
        </CardContent>
      </Card>
    </Collapse>
  );

  if (loading && isEdit) {
    return (
      <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ fontFamily: 'Sakkal Majalla' }}
            >
              جاري تحميل بيانات المشروع...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/projects')}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                border: '2px solid transparent',
                fontFamily: 'Sakkal Majalla',
                '&:hover': {
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  borderColor: 'primary.200'
                }
              }}
            >
              العودة للقائمة
            </Button>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                  fontFamily: 'Sakkal Majalla',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {isEdit ? 'تعديل المشروع' : 'إنشاء مشروع جديد'}
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {isEdit ? 'تحديث معلومات المشروع الحالي' : 'إضافة مشروع جديد إلى النظام'}
              </Typography>
            </Box>
          </Box>

          {/* Alerts */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 3,
                border: '1px solid #fecaca',
                fontFamily: 'Sakkal Majalla',
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 4,
                borderRadius: 3,
                border: '1px solid #bbf7d0',
                fontFamily: 'Sakkal Majalla',
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon />
                <Typography sx={{ fontWeight: 600, fontFamily: 'Sakkal Majalla' }}>
                  تم {isEdit ? 'تحديث' : 'إنشاء'} المشروع بنجاح! جاري التوجيه...
                </Typography>
              </Box>
            </Alert>
          )}

          {/* Stepper */}
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            mb: 4,
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={({ active, completed }) => (
                        <Avatar sx={{
                          bgcolor: active || completed ? 'primary.main' : 'grey.300',
                          color: 'white',
                          width: 40,
                          height: 40,
                          transition: 'all 0.3s ease'
                        }}>
                          {step.icon}
                        </Avatar>
                      )}
                    >
                      <Typography sx={{
                        fontWeight: activeStep === index ? 700 : 500,
                        color: activeStep === index ? 'primary.main' : 'text.secondary',
                        mt: 1,
                        fontFamily: 'Sakkal Majalla',
                        fontSize: '0.875rem'
                      }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box display="flex" justifyContent="center" gap={1} mt={3} flexWrap="wrap">
                {steps.map((_, index) => (
                  <Button
                    key={index}
                    variant={activeStep === index ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setActiveStep(index)}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            <FormSection
              title="المعلومات الأساسية"
              icon={<AssignmentIcon />}
              step={0}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="اسم المشروع"
                    value={formData.project_name}
                    onChange={(e) => handleInputChange('project_name', e.target.value)}
                    required
                    sx={fieldStyles}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="الجهة المستفيدة"
                    value={formData.beneficiary_organization}
                    onChange={(e) => handleInputChange('beneficiary_organization', e.target.value)}
                    required
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldStyles}>
                    <InputLabel>حالة المشروع</InputLabel>
                    <Select
                      value={formData.project_status}
                      onChange={(e) => handleInputChange('project_status', e.target.value)}
                      label="حالة المشروع"
                    >
                      {projectStatuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: status.color
                              }}
                            />
                            <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>
                              {status.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ملاحظات"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 2: Teams and Responsibilities */}
            <FormSection
              title="الفرق والمسؤوليات"
              icon={<PersonIcon />}
              step={1}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldStyles}>
                    <InputLabel>مدير المشروع بالجامعة</InputLabel>
                    <Select
                      value={formData.university_project_manager}
                      onChange={(e) => handleInputChange('university_project_manager', e.target.value)}
                      label="مدير المشروع بالجامعة"
                      required
                    >
                      {universityProjectManagers.map((manager) => (
                        <MenuItem key={manager} value={manager}>
                          <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>
                            {manager}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="المسؤول الفني بالجهة المستفيدة"
                    value={formData.technical_responsible_beneficiary}
                    onChange={(e) => handleInputChange('technical_responsible_beneficiary', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="فريق المشروع بالجامعة"
                    value={formData.university_project_team}
                    onChange={(e) => handleInputChange('university_project_team', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="اسم الشركة المنفذة"
                    value={formData.executing_company_name}
                    onChange={(e) => handleInputChange('executing_company_name', e.target.value)}
                    required
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="مدير المشروع (الشركة المنفذة)"
                    value={formData.executing_company_project_manager}
                    onChange={(e) => handleInputChange('executing_company_project_manager', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ممثل الشركة المنفذة"
                    value={formData.executing_company_representative}
                    onChange={(e) => handleInputChange('executing_company_representative', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 3: Authorization Data */}
            <FormSection
              title="بيانات التعميد"
              icon={<SecurityIcon />}
              step={2}
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رقم التعميد"
                    value={formData.authorization_data.authorization_number}
                    onChange={(e) => handleAuthorizationDataChange('authorization_number', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ التعميد"
                    value={formData.authorization_data.authorization_date}
                    onChange={(date) => handleAuthorizationDataChange('authorization_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات التعميد"
                    value={formData.authorization_data.notes}
                    onChange={(e) => handleAuthorizationDataChange('notes', e.target.value)}
                    multiline
                    rows={3}
                    sx={textAreaStyles}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 4: Financial Information */}
            <FormSection
              title="المعلومات المالية"
              icon={<MoneyIcon />}
              step={3}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="تكلفة المشروع (ريال سعودي)"
                    type="number"
                    value={formData.project_cost}
                    onChange={(e) => handleInputChange('project_cost', e.target.value)}
                    required
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رقم أمر الشراء (راسين)"
                    value={formData.purchase_order_number}
                    onChange={(e) => handleInputChange('purchase_order_number', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رقم التفويض"
                    value={formData.authorization_number}
                    onChange={(e) => handleInputChange('authorization_number', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ تفويض المشروع"
                    value={formData.project_authorization_date}
                    onChange={(date) => handleInputChange('project_authorization_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 5: Timeline */}
            <FormSection
              title="الجدول الزمني"
              icon={<ScheduleIcon />}
              step={4}
              gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ بداية المشروع"
                    value={formData.project_start_date}
                    onChange={(date) => handleInputChange('project_start_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldStyles}>
                    <InputLabel>نوع بداية المشروع</InputLabel>
                    <Select
                      value={formData.type_of_project_start}
                      onChange={(e) => handleInputChange('type_of_project_start', e.target.value)}
                      label="نوع بداية المشروع"
                    >
                      {projectStartTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>
                            {type.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="مدة المشروع (أيام)"
                    type="number"
                    value={formData.project_duration_days}
                    onChange={(e) => handleInputChange('project_duration_days', e.target.value)}
                    sx={fieldStyles}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ انتهاء المشروع المخطط"
                    value={formData.planned_project_end_date}
                    onChange={(date) => handleInputChange('planned_project_end_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ تسليم الموقع"
                    value={formData.site_handover_date}
                    onChange={(date) => handleInputChange('site_handover_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ توقيع العقد"
                    value={formData.contract_signing_date}
                    onChange={(date) => handleInputChange('contract_signing_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ إعداد الميثاق"
                    value={formData.charter_preparation_date}
                    onChange={(date) => handleInputChange('charter_preparation_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 6: License Data */}
            <FormSection
              title="بيانات الرخص"
              icon={<DescriptionIcon />}
              step={5}
              gradient="linear-gradient(135deg, #64748b 0%, #475569 100%)"
            >
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" sx={{ fontFamily: 'Sakkal Majalla', fontWeight: 600 }}>
                    قائمة الرخص
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addLicense}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      fontFamily: 'Sakkal Majalla',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      }
                    }}
                  >
                    إضافة رخصة
                  </Button>
                </Box>

                {formData.licenses.length === 0 ? (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 4, 
                      border: '2px dashed #e5e7eb', 
                      borderRadius: 3,
                      bgcolor: '#f9fafb'
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ fontFamily: 'Sakkal Majalla' }}
                    >
                      لا توجد رخص مضافة. اضغط على "إضافة رخصة" لإضافة رخصة جديدة.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {formData.licenses.map((license, index) => (
                      <Card 
                        key={license.id || index}
                        sx={{
                          borderRadius: 3,
                          border: '2px solid #e5e7eb',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontFamily: 'Sakkal Majalla', 
                                fontWeight: 600,
                                color: 'primary.main'
                              }}
                            >
                              رخصة رقم {index + 1}
                            </Typography>
                            <IconButton
                              onClick={() => removeLicense(index)}
                              sx={{
                                color: 'error.main',
                                '&:hover': {
                                  bgcolor: 'error.50',
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="رقم الرخصة"
                                value={license.license_number}
                                onChange={(e) => handleLicenseChange(index, 'license_number', e.target.value)}
                                sx={fieldStyles}
                              />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="اسم الرخصة"
                                value={license.license_name}
                                onChange={(e) => handleLicenseChange(index, 'license_name', e.target.value)}
                                sx={fieldStyles}
                              />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <DatePicker
                                label="تاريخ بداية الرخصة"
                                value={license.start_date}
                                onChange={(date) => handleLicenseChange(index, 'start_date', date)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    sx={fieldStyles}
                                  />
                                )}
                              />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <DatePicker
                                label="تاريخ انتهاء الرخصة"
                                value={license.end_date}
                                onChange={(date) => handleLicenseChange(index, 'end_date', date)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    sx={fieldStyles}
                                  />
                                )}
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="ملاحظات الرخصة"
                                value={license.notes}
                                onChange={(e) => handleLicenseChange(index, 'notes', e.target.value)}
                                multiline
                                rows={2}
                                sx={textAreaStyles}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </FormSection>

            {/* Action Buttons */}
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              mt: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        fontFamily: 'Sakkal Majalla',
                        height: '48px'
                      }}
                    >
                      السابق
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                      disabled={activeStep === steps.length - 1}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        fontFamily: 'Sakkal Majalla',
                        height: '48px'
                      }}
                    >
                      التالي
                    </Button>
                  </Box>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/projects')}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderColor: 'grey.300',
                        color: 'grey.700',
                        fontFamily: 'Sakkal Majalla',
                        height: '48px',
                        '&:hover': {
                          borderColor: 'grey.400',
                          bgcolor: 'grey.50'
                        }
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading}
                      sx={{
                        borderRadius: 3,
                        px: 6,
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                        fontFamily: 'Sakkal Majalla',
                        height: '48px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          background: 'grey.300',
                          boxShadow: 'none',
                          transform: 'none'
                        }
                      }}
                    >
                      {loading ? 'جاري الحفظ...' : (isEdit ? 'تحديث المشروع' : 'حفظ المشروع')}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </form>
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectForm;