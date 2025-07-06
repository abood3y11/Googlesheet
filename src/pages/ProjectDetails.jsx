import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getProjectById(id);
      setProject(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      planning: 'default',
      in_progress: 'primary',
      suspended: 'warning',
      completed: 'success',
      cancelled: 'error',
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      planning: 'تخطيط',
      in_progress: 'قيد التنفيذ',
      suspended: 'متوقف',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    };
    return statusLabels[status] || status;
  };

  const getStartTypeLabel = (type) => {
    const typeLabels = {
      immediate: 'فوري',
      scheduled: 'مجدول',
      conditional: 'مشروط',
    };
    return typeLabels[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'غير محدد';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/projects')}>
          العودة إلى قائمة المشاريع
        </Button>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          المشروع غير موجود
        </Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/projects')}>
          العودة إلى قائمة المشاريع
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/projects')}
            sx={{ mr: 2 }}
          >
            العودة
          </Button>
          <Typography variant="h4" component="h1">
            تفاصيل المشروع
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/projects/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            تعديل
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Project Header */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                {project.project_name}
              </Typography>
              <Chip
                label={getStatusLabel(project.project_status)}
                color={getStatusColor(project.project_status)}
                size="large"
              />
            </Box>
            <Divider />
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              المعلومات الأساسية
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              الجهة المستفيدة
            </Typography>
            <Typography variant="body1">
              {project.beneficiary_organization}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              مدير المشروع بالجامعة
            </Typography>
            <Typography variant="body1">
              {project.university_project_manager}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              المسؤول الفني بالجهة المستفيدة
            </Typography>
            <Typography variant="body1">
              {project.technical_responsible_beneficiary}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              فريق المشروع بالجامعة
            </Typography>
            <Typography variant="body1">
              {project.university_project_team}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              اسم الشركة المنفذة
            </Typography>
            <Typography variant="body1">
              {project.executing_company_name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              مدير المشروع (الشركة المنفذة)
            </Typography>
            <Typography variant="body1">
              {project.executing_company_project_manager}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              معلومات ممثل المشروع (الشركة المنفذة)
            </Typography>
            <Typography variant="body1">
              {project.executing_company_representative}
            </Typography>
          </Grid>

          {/* Authorization and Financial */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              التفويض والمعلومات المالية
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              رقم التفويض
            </Typography>
            <Typography variant="body1">
              {project.authorization_number}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ تفويض المشروع
            </Typography>
            <Typography variant="body1">
              {formatDate(project.project_authorization_date)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تكلفة المشروع
            </Typography>
            <Typography variant="body1">
              {formatCurrency(project.project_cost)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              رقم أمر الشراء (راسين)
            </Typography>
            <Typography variant="body1">
              {project.purchase_order_number}
            </Typography>
          </Grid>

          {/* Project Timeline */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              الجدول الزمني للمشروع
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ إعداد الميثاق
            </Typography>
            <Typography variant="body1">
              {formatDate(project.charter_preparation_date)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ بداية المشروع
            </Typography>
            <Typography variant="body1">
              {formatDate(project.project_start_date)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              نوع بداية المشروع
            </Typography>
            <Typography variant="body1">
              {getStartTypeLabel(project.type_of_project_start)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              مدة المشروع (أيام)
            </Typography>
            <Typography variant="body1">
              {project.project_duration_days || 'غير محدد'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ انتهاء المشروع المخطط
            </Typography>
            <Typography variant="body1">
              {formatDate(project.planned_project_end_date)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ انتهاء المشروع الفعلي
            </Typography>
            <Typography variant="body1">
              {formatDate(project.actual_project_end_date)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ تسليم الموقع
            </Typography>
            <Typography variant="body1">
              {formatDate(project.site_handover_date)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ توقيع العقد
            </Typography>
            <Typography variant="body1">
              {formatDate(project.contract_signing_date)}
            </Typography>
          </Grid>

          {/* Project Status Details */}
          {(project.project_suspension_date || project.suspension_duration || project.project_resumption_date) && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  تفاصيل الإيقاف والاستئناف
                </Typography>
              </Grid>

              {project.project_suspension_date && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    تاريخ إيقاف المشروع
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(project.project_suspension_date)}
                  </Typography>
                </Grid>
              )}

              {project.suspension_duration && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    مدة الإيقاف (أيام)
                  </Typography>
                  <Typography variant="body1">
                    {project.suspension_duration}
                  </Typography>
                </Grid>
              )}

              {project.project_resumption_date && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    تاريخ استئناف المشروع
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(project.project_resumption_date)}
                  </Typography>
                </Grid>
              )}
            </>
          )}

          {/* Notes */}
          {project.notes && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  ملاحظات
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {project.notes}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProjectDetails;
