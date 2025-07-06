import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  Paper,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { projectsAPI } from './services/api';

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { 
    control, 
    handleSubmit, 
    setFocus, 
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
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
      type_of_project_start: 'from_contract',
      project_duration_days: '',
      planned_project_end_date: null,
      site_handover_date: null,
      contract_signing_date: null,
      project_status: 'planning',
      project_suspension_date: null,
      suspension_duration: '',
      project_resumption_date: null,
      notes: '',
      // بيانات التعميد
      authorization_number_mandate: '',
      authorization_date_mandate: null,
      authorization_notes: '',
      // بيانات الرخص
      licenses: []
    }
  });

  // استخدام useFieldArray للرخص
  const { fields: licenseFields, append: appendLicense, remove: removeLicense } = useFieldArray({
    control,
    name: "licenses"
  });

  const steps = [
    { label: 'المعلومات الأساسية', icon: <AssignmentIcon /> },
    { label: 'الفرق والمسؤوليات', icon: <PersonIcon /> },
    { label: 'بيانات التعميد', icon: <DescriptionIcon /> },
    { label: 'المعلومات المالية', icon: <MoneyIcon /> },
    { label: 'الجدول الزمني', icon: <ScheduleIcon /> },
    { label: 'بيانات الرخص', icon: <DescriptionIcon /> },
  ];

  // مراقبة التغييرات للحسابات التلقائية
  const watchedStartDate = watch('project_start_date');
  const watchedDuration = watch('project_duration_days');
  const watchedEndDate = watch('planned_project_end_date');

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

  // حساب تلقائي للتواريخ والمدة
  useEffect(() => {
    if (watchedStartDate && watchedDuration && !isNaN(watchedDuration)) {
      const endDate = dayjs(watchedStartDate).add(parseInt(watchedDuration), 'day');
      setValue('planned_project_end_date', endDate);
    }
  }, [watchedStartDate, watchedDuration, setValue]);

  useEffect(() => {
    if (watchedStartDate && watchedEndDate) {
      const duration = dayjs(watchedEndDate).diff(dayjs(watchedStartDate), 'day');
      if (duration > 0) {
        setValue('project_duration_days', duration.toString());
      }
    }
  }, [watchedStartDate, watchedEndDate, setValue]);

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
        'authorization_date_mandate'
      ];
      
      dateFields.forEach(field => {
        if (formattedProject[field]) {
          formattedProject[field] = dayjs(formattedProject[field]);
        }
      });

      // تحويل الرخص إذا كانت موجودة
      if (project.licenses && project.licenses.length > 0) {
        formattedProject.licenses = project.licenses.map(license => ({
          ...license,
          license_start_date: license.license_start_date ? dayjs(license.license_start_date) : null,
          license_end_date: license.license_end_date ? dayjs(license.license_end_date) : null,
        }));
      } else {
        formattedProject.licenses = [];
      }
      
      reset(formattedProject);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const submitData = { ...data };
      const dateFields = [
        'project_authorization_date',
        'charter_preparation_date',
        'project_start_date',
        'planned_project_end_date',
        'site_handover_date',
        'contract_signing_date',
        'project_suspension_date',
        'project_resumption_date',
        'authorization_date_mandate'
      ];
      
      dateFields.forEach(field => {
        if (submitData[field] && dayjs.isDayjs(submitData[field])) {
          submitData[field] = submitData[field].format('YYYY-MM-DD');
        }
      });

      // تحويل الرخص
      if (submitData.licenses && submitData.licenses.length > 0) {
        submitData.licenses = submitData.licenses.map(license => {
          const formattedLicense = { ...license };
          if (formattedLicense.license_start_date && dayjs.isDayjs(formattedLicense.license_start_date)) {
            formattedLicense.license_start_date = formattedLicense.license_start_date.format('YYYY-MM-DD');
          }
          if (formattedLicense.license_end_date && dayjs.isDayjs(formattedLicense.license_end_date)) {
            formattedLicense.license_end_date = formattedLicense.license_end_date.format('YYYY-MM-DD');
          }
          return formattedLicense;
        });
      }

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

  const onError = (errors) => {
    console.log('Form errors:', errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      setFocus(firstError);
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
    { value: 'from_contract', label: 'من توقيع العقد' },
    { value: 'from_authorization', label: 'من التعميد' },
    { value: 'from_site_handover', label: 'من استلام الموقع' },
  ];

  const universityProjectManagers = [
    'محمد الشهري',
    'نجلاء الحمَيد', 
    'نوف الفارس',
    'يوسف العنزي',
    'سارة المقرن',
    'عمار القحطاني'
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

  const addLicense = () => {
    appendLicense({
      license_number: '',
      license_name: '',
      license_start_date: null,
      license_end_date: null,
      notes: '',
    });
  };

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
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            {/* Step 1: Basic Information */}
            <FormSection
              title="المعلومات الأساسية"
              icon={<AssignmentIcon />}
              step={0}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="project_name"
                    control={control}
                    rules={{ required: "اسم المشروع مطلوب" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="اسم المشروع"
                        error={!!errors.project_name}
                        helperText={errors.project_name?.message}
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Controller
                    name="beneficiary_organization"
                    control={control}
                    rules={{ required: "الجهة المستفيدة مطلوبة" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="الجهة المستفيدة"
                        error={!!errors.beneficiary_organization}
                        helperText={errors.beneficiary_organization?.message}
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="project_status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={fieldStyles}>
                        <InputLabel>حالة المشروع</InputLabel>
                        <Select
                          {...field}
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
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="ملاحظات"
                        sx={fieldStyles}
                      />
                    )}
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
                  <Controller
                    name="university_project_manager"
                    control={control}
                    rules={{ required: "مدير المشروع بالجامعة مطلوب" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="مدير المشروع بالجامعة"
                        select
                        error={!!errors.university_project_manager}
                        helperText={errors.university_project_manager?.message}
                        sx={fieldStyles}
                      >
                        {universityProjectManagers.map((manager) => (
                          <MenuItem key={manager} value={manager}>
                            <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>
                              {manager}
                            </Typography>
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="technical_responsible_beneficiary"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="المسؤول الفني بالجهة المستفيدة"
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="university_project_team"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="فريق المشروع بالجامعة"
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="executing_company_name"
                    control={control}
                    rules={{ required: "اسم الشركة المنفذة مطلوب" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="اسم الشركة المنفذة"
                        error={!!errors.executing_company_name}
                        helperText={errors.executing_company_name?.message}
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="executing_company_project_manager"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="مدير المشروع (الشركة المنفذة)"
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="executing_company_representative"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="ممثل الشركة المنفذة"
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 3: Authorization Data */}
            <FormSection
              title="بيانات التعميد"
              icon={<DescriptionIcon />}
              step={2}
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="authorization_number_mandate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="رقم التعميد"
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="authorization_date_mandate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="تاريخ التعميد"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={fieldStyles}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="authorization_notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="ملاحظات التعميد"
                        multiline
                        rows={4}
                        sx={textAreaStyles}
                      />
                    )}
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
                  <Controller
                    name="project_cost"
                    control={control}
                    rules={{ 
                      required: "تكلفة المشروع مطلوبة",
                      min: { value: 1, message: "التكلفة يجب أن تكون أكبر من صفر" }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="تكلفة المشروع (ريال سعودي)"
                        type="number"
                        error={!!errors.project_cost}
                        helperText={errors.project_cost?.message}
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="purchase_order_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="رقم أمر الشراء (راسين)"
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="authorization_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="رقم التفويض"
                        sx={fieldStyles}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="project_authorization_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="تاريخ تفويض المشروع"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={fieldStyles}
                          />
                        )}
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
                  <Controller
                    name="project_start_date"
                    control={control}
                    rules={{ required: "تاريخ بداية المشروع مطلوب" }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="تاريخ بداية المشروع"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.project_start_date}
                            helperText={errors.project_start_date?.message}
                            sx={fieldStyles}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="type_of_project_start"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={fieldStyles}>
                        <InputLabel>نوع بداية المشروع</InputLabel>
                        <Select
                          {...field}
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
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="project_duration_days"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="مدة المشروع (أيام)"
                        type="number"
                        sx={fieldStyles}
                        helperText="سيتم حساب تاريخ الانتهاء تلقائياً"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="planned_project_end_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="تاريخ انتهاء المشروع المخطط"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={fieldStyles}
                            helperText="سيتم حساب المدة تلقائياً"
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="site_handover_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="تاريخ تسليم الموقع"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={fieldStyles}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="contract_signing_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="تاريخ توقيع العقد"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={fieldStyles}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="charter_preparation_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="تاريخ إعداد الميثاق"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={fieldStyles}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'info.50',
                    border: '1px solid',
                    borderColor: 'info.200'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'info.main',
                        fontFamily: 'Sakkal Majalla',
                        mb: 1
                      }}
                    >
                      ملاحظة هامة:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'info.dark',
                        fontFamily: 'Sakkal Majalla',
                        lineHeight: 1.6
                      }}
                    >
                      • تاريخ انتهاء المشروع الفعلي يتم حسابه تلقائياً من النظام<br/>
                      • عند إدخال تاريخ البداية والمدة، سيتم حساب تاريخ الانتهاء المخطط تلقائياً<br/>
                      • عند إدخال تاريخ البداية والانتهاء المخطط، سيتم حساب المدة تلقائياً
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </FormSection>

            {/* Step 6: License Data */}
            <FormSection
              title="بيانات الرخص"
              icon={<DescriptionIcon />}
              step={5}
              gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            >
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    إدارة رخص المشروع
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
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      fontFamily: 'Sakkal Majalla',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    إضافة رخصة
                  </Button>
                </Box>

                {licenseFields.length === 0 ? (
                  <Box 
                    sx={{
                      textAlign: 'center',
                      py: 6,
                      border: '2px dashed #d1d5db',
                      borderRadius: 3,
                      bgcolor: '#f9fafb'
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        fontFamily: 'Sakkal Majalla'
                      }}
                    >
                      لا توجد رخص مضافة
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontFamily: 'Sakkal Majalla' }}
                    >
                      اضغط على "إضافة رخصة" لبدء إضافة رخص المشروع
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={3}>
                    {licenseFields.map((field, index) => (
                      <Paper key={field.id} sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '2px solid #e5e7eb',
                        position: 'relative',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                        }
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: 'primary.main',
                              fontFamily: 'Sakkal Majalla'
                            }}
                          >
                            الرخصة #{index + 1}
                          </Typography>
                          <IconButton
                            onClick={() => removeLicense(index)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.50'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Controller
                              name={`licenses.${index}.license_number`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="رقم الرخصة"
                                  sx={fieldStyles}
                                />
                              )}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Controller
                              name={`licenses.${index}.license_name`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="اسم الرخصة"
                                  sx={fieldStyles}
                                />
                              )}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Controller
                              name={`licenses.${index}.license_start_date`}
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  label="تاريخ بداية الرخصة"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      sx={fieldStyles}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Controller
                              name={`licenses.${index}.license_end_date`}
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  label="تاريخ انتهاء الرخصة"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      sx={fieldStyles}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Controller
                              name={`licenses.${index}.notes`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="ملاحظات الرخصة"
                                  multiline
                                  rows={3}
                                  sx={textAreaStyles}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
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
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={isSubmitting}
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
                      {isSubmitting ? 'جاري الحفظ...' : (isEdit ? 'تحديث المشروع' : 'حفظ المشروع')}
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