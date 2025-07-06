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
  Fade
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Save as SaveIcon, ArrowBack as BackIcon, Business as BusinessIcon } from '@mui/icons-material';
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

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const project = await projectsAPI.getProjectById(id);
      
      // Convert date strings to dayjs objects
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
      
      // Convert dayjs objects to ISO strings
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

      // Convert numeric fields
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
    { value: 'planning', label: 'تخطيط' },
    { value: 'in_progress', label: 'قيد التنفيذ' },
    { value: 'suspended', label: 'متوقف' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'cancelled', label: 'ملغي' },
  ];

  const projectStartTypes = [
    { value: 'immediate', label: 'فوري' },
    { value: 'scheduled', label: 'مجدول' },
    { value: 'conditional', label: 'مشروط' },
  ];

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box display="flex" alignItems="center" mb={4}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/projects')}
            sx={{
              mr: 2,
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.50',
                color: 'primary.main'
              }
            }}
          >
            العودة
          </Button>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {isEdit ? 'تعديل المشروع' : 'مشروع جديد'}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
          >
            تم {isEdit ? 'تحديث' : 'إنشاء'} المشروع بنجاح!
          </Alert>
        )}

        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Column 1 - Most Important Fields */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ pr: { md: 2 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <BusinessIcon />
                      المعلومات الأساسية
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="اسم المشروع"
                        value={formData.project_name}
                        onChange={(e) => handleInputChange('project_name', e.target.value)}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="الجهة المستفيدة"
                        value={formData.beneficiary_organization}
                        onChange={(e) => handleInputChange('beneficiary_organization', e.target.value)}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="مدير المشروع بالجامعة"
                        value={formData.university_project_manager}
                        onChange={(e) => handleInputChange('university_project_manager', e.target.value)}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="اسم الشركة المنفذة"
                        value={formData.executing_company_name}
                        onChange={(e) => handleInputChange('executing_company_name', e.target.value)}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="تكلفة المشروع"
                        type="number"
                        value={formData.project_cost}
                        onChange={(e) => handleInputChange('project_cost', e.target.value)}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <DatePicker
                        label="تاريخ بداية المشروع"
                        value={formData.project_start_date}
                        onChange={(date) => handleInputChange('project_start_date', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                      />

                      <DatePicker
                        label="تاريخ انتهاء المشروع المخطط"
                        value={formData.planned_project_end_date}
                        onChange={(date) => handleInputChange('planned_project_end_date', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                      />

                      <FormControl fullWidth>
                        <InputLabel>حالة المشروع</InputLabel>
                        <Select
                          value={formData.project_status}
                          onChange={(e) => handleInputChange('project_status', e.target.value)}
                          label="حالة المشروع"
                          sx={{ borderRadius: 2 }}
                        >
                          {projectStatuses.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                              {status.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Grid>

                {/* Column 2 - Secondary Fields */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ pl: { md: 2 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <BusinessIcon />
                      المعلومات التفصيلية
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="المسؤول الفني بالجهة المستفيدة"
                        value={formData.technical_responsible_beneficiary}
                        onChange={(e) => handleInputChange('technical_responsible_beneficiary', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="فريق المشروع بالجامعة"
                        value={formData.university_project_team}
                        onChange={(e) => handleInputChange('university_project_team', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="مدير المشروع (الشركة المنفذة)"
                        value={formData.executing_company_project_manager}
                        onChange={(e) => handleInputChange('executing_company_project_manager', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="ممثل الشركة المنفذة"
                        value={formData.executing_company_representative}
                        onChange={(e) => handleInputChange('executing_company_representative', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <TextField
                        fullWidth
                        label="رقم أمر الشراء"
                        value={formData.purchase_order_number}
                        onChange={(e) => handleInputChange('purchase_order_number', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />

                      <DatePicker
                        label="تاريخ تسليم الموقع"
                        value={formData.site_handover_date}
                        onChange={(date) => handleInputChange('site_handover_date', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                      />

                      <DatePicker
                        label="تاريخ انتهاء المشروع الفعلي"
                        value={formData.actual_project_end_date}
                        onChange={(date) => handleInputChange('actual_project_end_date', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                      />

                      <TextField
                        fullWidth
                        label="ملاحظات"
                        multiline
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Submit Buttons */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/projects')}
                      sx={{
                        borderRadius: 2,
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
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-1px)'
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
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default ProjectForm;
