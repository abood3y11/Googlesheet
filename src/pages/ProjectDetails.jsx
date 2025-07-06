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
  Card,
  CardContent,
  Avatar,
  Stack,
  Container,
  Fade,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

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

  const handleDelete = async () => {
    try {
      await projectsAPI.deleteProject(id);
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusConfig = (status) => {
    const statusConfigs = {
      planning: {
        color: '#3b82f6',
        bg: '#eff6ff',
        border: '#bfdbfe',
        icon: <InfoIcon />,
        label: 'تخطيط'
      },
      in_progress: {
        color: '#10b981',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: <CheckCircleIcon />,
        label: 'قيد التنفيذ'
      },
      suspended: {
        color: '#f59e0b',
        bg: '#fffbeb',
        border: '#fed7aa',
        icon: <WarningIcon />,
        label: 'متوقف'
      },
      completed: {
        color: '#8b5cf6',
        bg: '#faf5ff',
        border: '#e9d5ff',
        icon: <CheckCircleIcon />,
        label: 'مكتمل'
      },
      cancelled: {
        color: '#ef4444',
        bg: '#fef2f2',
        border: '#fecaca',
        icon: <ErrorIcon />,
        label: 'ملغي'
      },
    };
    return statusConfigs[status] || statusConfigs.planning;
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
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'غير محدد';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const InfoCard = ({ title, icon, children, gradient }) => (
    <Card sx={{
      height: '100%',
      borderRadius: 4,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      }
    }}>
      <Box sx={{
        background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 2.5,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(25px, -25px)',
        }
      }}>
        <Box display="flex" alignItems="center" gap={2} position="relative" zIndex={1}>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            width: 48,
            height: 48
          }}>
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
      </Box>
      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
    </Card>
  );

  const DetailItem = ({ label, value, icon }) => (
    <Box display="flex" alignItems="flex-start" gap={2} py={1}>
      {icon && (
        <Box sx={{ color: 'text.secondary', mt: 0.5 }}>
          {icon}
        </Box>
      )}
      <Box flex={1}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
          {value || 'غير محدد'}
        </Typography>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              جاري تحميل تفاصيل المشروع...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              '& .MuiAlert-icon': { fontSize: 24 }
            }}
          >
            {error}
          </Alert>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/projects')}
            variant="contained"
            sx={{ borderRadius: 3 }}
          >
            العودة إلى قائمة المشاريع
          </Button>
        </Box>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 3,
              '& .MuiAlert-icon': { fontSize: 24 }
            }}
          >
            المشروع غير موجود
          </Alert>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/projects')}
            variant="contained"
            sx={{ borderRadius: 3 }}
          >
            العودة إلى قائمة المشاريع
          </Button>
        </Box>
      </Container>
    );
  }

  const statusConfig = getStatusConfig(project.project_status);

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
            <Box display="flex" alignItems="center" gap={3}>
              <Button
                startIcon={<BackIcon />}
                onClick={() => navigate('/projects')}
                sx={{
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
                    mb: 1,
                    lineHeight: 1.2
                  }}
                >
                  {project.project_name}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    icon={statusConfig.icon}
                    label={statusConfig.label}
                    sx={{
                      bgcolor: statusConfig.bg,
                      color: statusConfig.color,
                      border: `2px solid ${statusConfig.border}`,
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      height: 36,
                      '& .MuiChip-icon': {
                        color: statusConfig.color
                      }
                    }}
                  />
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    المعرف: {project.id}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box display="flex" gap={2}>
              <Tooltip title="تعديل المشروع">
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: 'primary.300',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.50',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  تعديل
                </Button>
              </Tooltip>
              <Tooltip title="حذف المشروع">
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialog(true)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: 'error.300',
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.50',
                      borderColor: 'error.main'
                    }
                  }}
                >
                  حذف
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Content Grid */}
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12} lg={6}>
              <InfoCard
                title="المعلومات الأساسية"
                icon={<AssignmentIcon />}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              >
                <Stack spacing={2}>
                  <DetailItem
                    label="الجهة المستفيدة"
                    value={project.beneficiary_organization}
                    icon={<BusinessIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="مدير المشروع بالجامعة"
                    value={project.university_project_manager}
                    icon={<PersonIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="فريق المشروع بالجامعة"
                    value={project.university_project_team}
                    icon={<PersonIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="المسؤول الفني بالجهة المستفيدة"
                    value={project.technical_responsible_beneficiary}
                    icon={<PersonIcon fontSize="small" />}
                  />
                </Stack>
              </InfoCard>
            </Grid>

            {/* Company Information */}
            <Grid item xs={12} lg={6}>
              <InfoCard
                title="معلومات الشركة المنفذة"
                icon={<BusinessIcon />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              >
                <Stack spacing={2}>
                  <DetailItem
                    label="اسم الشركة المنفذة"
                    value={project.executing_company_name}
                    icon={<BusinessIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="مدير المشروع (الشركة المنفذة)"
                    value={project.executing_company_project_manager}
                    icon={<PersonIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="ممثل الشركة المنفذة"
                    value={project.executing_company_representative}
                    icon={<PersonIcon fontSize="small" />}
                  />
                </Stack>
              </InfoCard>
            </Grid>

            {/* Financial Information */}
            <Grid item xs={12} lg={6}>
              <InfoCard
                title="المعلومات المالية"
                icon={<MoneyIcon />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              >
                <Stack spacing={2}>
                  <DetailItem
                    label="تكلفة المشروع"
                    value={formatCurrency(project.project_cost)}
                    icon={<MoneyIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="رقم التفويض"
                    value={project.authorization_number}
                    icon={<DescriptionIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="تاريخ تفويض المشروع"
                    value={formatDate(project.project_authorization_date)}
                    icon={<CalendarIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="رقم أمر الشراء (راسين)"
                    value={project.purchase_order_number}
                    icon={<DescriptionIcon fontSize="small" />}
                  />
                </Stack>
              </InfoCard>
            </Grid>

            {/* Timeline Information */}
            <Grid item xs={12} lg={6}>
              <InfoCard
                title="الجدول الزمني"
                icon={<ScheduleIcon />}
                gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              >
                <Stack spacing={2}>
                  <DetailItem
                    label="تاريخ إعداد الميثاق"
                    value={formatDate(project.charter_preparation_date)}
                    icon={<CalendarIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="تاريخ بداية المشروع"
                    value={formatDate(project.project_start_date)}
                    icon={<CalendarIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="نوع بداية المشروع"
                    value={getStartTypeLabel(project.type_of_project_start)}
                    icon={<TimelineIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="مدة المشروع (أيام)"
                    value={project.project_duration_days}
                    icon={<ScheduleIcon fontSize="small" />}
                  />
                </Stack>
              </InfoCard>
            </Grid>

            {/* Project Dates */}
            <Grid item xs={12} lg={6}>
              <InfoCard
                title="تواريخ المشروع"
                icon={<CalendarIcon />}
                gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
              >
                <Stack spacing={2}>
                  <DetailItem
                    label="تاريخ انتهاء المشروع المخطط"
                    value={formatDate(project.planned_project_end_date)}
                    icon={<CalendarIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="تاريخ انتهاء المشروع الفعلي"
                    value={formatDate(project.actual_project_end_date)}
                    icon={<CalendarIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="تاريخ تسليم الموقع"
                    value={formatDate(project.site_handover_date)}
                    icon={<LocationIcon fontSize="small" />}
                  />
                  <DetailItem
                    label="تاريخ توقيع العقد"
                    value={formatDate(project.contract_signing_date)}
                    icon={<DescriptionIcon fontSize="small" />}
                  />
                </Stack>
              </InfoCard>
            </Grid>

            {/* Suspension Information */}
            {(project.project_suspension_date || project.suspension_duration || project.project_resumption_date) && (
              <Grid item xs={12} lg={6}>
                <InfoCard
                  title="معلومات الإيقاف والاستئناف"
                  icon={<WarningIcon />}
                  gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                >
                  <Stack spacing={2}>
                    {project.project_suspension_date && (
                      <DetailItem
                        label="تاريخ إيقاف المشروع"
                        value={formatDate(project.project_suspension_date)}
                        icon={<CalendarIcon fontSize="small" />}
                      />
                    )}
                    {project.suspension_duration && (
                      <DetailItem
                        label="مدة الإيقاف (أيام)"
                        value={project.suspension_duration}
                        icon={<ScheduleIcon fontSize="small" />}
                      />
                    )}
                    {project.project_resumption_date && (
                      <DetailItem
                        label="تاريخ استئناف المشروع"
                        value={formatDate(project.project_resumption_date)}
                        icon={<CalendarIcon fontSize="small" />}
                      />
                    )}
                  </Stack>
                </InfoCard>
              </Grid>
            )}

            {/* Notes */}
            {project.notes && (
              <Grid item xs={12}>
                <InfoCard
                  title="ملاحظات"
                  icon={<DescriptionIcon />}
                  gradient="linear-gradient(135deg, #64748b 0%, #475569 100%)"
                >
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.8,
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {project.notes}
                  </Typography>
                </InfoCard>
              </Grid>
            )}
          </Grid>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog}
            onClose={() => setDeleteDialog(false)}
            PaperProps={{
              sx: {
                borderRadius: 4,
                minWidth: 400,
                overflow: 'hidden'
              }
            }}
          >
            <DialogTitle sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              pb: 2,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              textAlign: 'center'
            }}>
              تأكيد حذف المشروع
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3, textAlign: 'center' }}>
              <DeleteIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                هل أنت متأكد من حذف هذا المشروع؟
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                "{project.project_name}"
              </Typography>
              <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                هذا الإجراء لا يمكن التراجع عنه
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={() => setDeleteDialog(false)}
                variant="outlined"
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
                onClick={handleDelete}
                variant="contained"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  }
                }}
              >
                حذف المشروع
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Fade>
  );
};

export default ProjectDetails;