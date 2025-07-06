import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Divider,
  Fade,
  Container,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  Chip
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
  CheckCircle as CheckCircleIcon
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
    type_of_project_start: 'immediate',
    project_duration_days: '',
    planned_project_end_date: null,
    actual_project_end_date: null,
    site_handover_date: null,
    contract_signing_date: null,
    project_status: 'planning',
    project_suspension_date: null,
    suspension_duration: '',
    project_resumption_date: null,
    notes: '',
  });

  const steps = [
    { label: 'المعلومات الأساسية', icon: <AssignmentIcon /> },
    { label: 'الفرق والمسؤوليات', icon: <PersonIcon /> },
    { label: 'المعلومات المالية', icon: <MoneyIcon /> },
    { label: 'الجدول الزمني', icon: <ScheduleIcon /> },
  ];

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

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
        'actual_project_end_date',
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
        'actual_project_end_date',
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
    { value: 'immediate', label: 'فوري' },
    { value: 'scheduled', label: 'مجدول' },
    { value: 'conditional', label: 'مشروط' },
  ];

  const FormSection = ({ title, icon, children, step }) => (
    <Collapse in={activeStep === step} timeout={500}>
      <Card sx={{
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        mb: 3
      }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              {icon}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
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
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              جاري تحميل بيانات المشروع...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" mb={4}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/projects')}
              sx={{
                mr: 3,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                border: '2px solid transparent',
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
                  mb: 0.5
                }}
              >
                {isEdit ? 'تعديل المشروع' : 'إنشاء مشروع جديد'}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
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
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon />
                <Typography sx={{ fontWeight: 600 }}>
                  تم {isEdit ? 'تحديث' : 'إنشاء'} المشروع بنجاح! جاري التوجيه...
                </Typography>
              </Box>
            </Alert>
          )}

          {/* Stepper */}
          <Card sx={{
            borderRadius: 4,
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
                        mt: 1
                      }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box display="flex" justifyContent="center" gap={1} mt={3}>
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
                      fontWeight: 600
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="اسم المشروع"
                    value={formData.project_name}
                    onChange={(e) => handleInputChange('project_name', e.target.value)}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="الجهة المستفيدة"
                    value={formData.beneficiary_organization}
                    onChange={(e) => handleInputChange('beneficiary_organization', e.target.value)}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>حالة المشروع</InputLabel>
                    <Select
                      value={formData.project_status}
                      onChange={(e) => handleInputChange('project_status', e.target.value)}
                      label="حالة المشروع"
                      sx={{ borderRadius: 3 }}
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
                            {status.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 2: Teams and Responsibilities */}
            <FormSection
              title="الفرق والمسؤوليات"
              icon={<PersonIcon />}
              step={1}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="مدير المشروع بالجامعة"
                    value={formData.university_project_manager}
                    onChange={(e) => handleInputChange('university_project_manager', e.target.value)}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="المسؤول الفني بالجهة المستفيدة"
                    value={formData.technical_responsible_beneficiary}
                    onChange={(e) => handleInputChange('technical_responsible_beneficiary', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="فريق المشروع بالجامعة"
                    value={formData.university_project_team}
                    onChange={(e) => handleInputChange('university_project_team', e.target.value)}
                    multiline
                    rows={2}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="اسم الشركة المنفذة"
                    value={formData.executing_company_name}
                    onChange={(e) => handleInputChange('executing_company_name', e.target.value)}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="مدير المشروع (الشركة المنفذة)"
                    value={formData.executing_company_project_manager}
                    onChange={(e) => handleInputChange('executing_company_project_manager', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ممثل الشركة المنفذة"
                    value={formData.executing_company_representative}
                    onChange={(e) => handleInputChange('executing_company_representative', e.target.value)}
                    multiline
                    rows={2}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 3: Financial Information */}
            <FormSection
              title="المعلومات المالية"
              icon={<MoneyIcon />}
              step={2}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رقم أمر الشراء (راسين)"
                    value={formData.purchase_order_number}
                    onChange={(e) => handleInputChange('purchase_order_number', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رقم التفويض"
                    value={formData.authorization_number}
                    onChange={(e) => handleInputChange('authorization_number', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 4: Timeline */}
            <FormSection
              title="الجدول الزمني"
              icon={<ScheduleIcon />}
              step={3}
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>نوع بداية المشروع</InputLabel>
                    <Select
                      value={formData.type_of_project_start}
                      onChange={(e) => handleInputChange('type_of_project_start', e.target.value)}
                      label="نوع بداية المشروع"
                      sx={{ borderRadius: 3 }}
                    >
                      {projectStartTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ انتهاء المشروع الفعلي"
                    value={formData.actual_project_end_date}
                    onChange={(date) => handleInputChange('actual_project_end_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Action Buttons */}
            <Card sx={{
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              mt: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600
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
                        fontWeight: 600
                      }}
                    >
                      التالي
                    </Button>
                  </Box>

                  <Box display="flex" gap={2}>
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
      </Container>
    </Fade>
  );
};

export default ProjectForm;