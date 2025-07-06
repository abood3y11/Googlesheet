import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Fade,
  Skeleton,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Container
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await projectsAPI.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setDeleteDialog({ open: false, project: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      planning: { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
      in_progress: { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0' },
      suspended: { bg: '#fffbeb', color: '#d97706', border: '#fed7aa' },
      completed: { bg: '#f0f9ff', color: '#7c3aed', border: '#c4b5fd' },
      cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    };
    return statusColors[status] || statusColors.planning;
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

  const formatCurrency = (amount) => {
    if (!amount) return 'غير محدد';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // Calculate statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.project_status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.project_status === 'in_progress').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.project_cost || 0), 0);

  const StatCard = ({ title, value, icon, gradient, subtitle }) => (
    <Card sx={{
      background: gradient,
      color: 'white',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transform: 'translate(30px, -30px)',
      }
    }}>
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, fontSize: '2.5rem' }}>
              {value}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            width: 60,
            height: 60,
            backdropFilter: 'blur(10px)'
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }) => {
    const statusStyle = getStatusColor(project.project_status);
    
    return (
      <Card sx={{
        height: '100%',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          '& .project-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${statusStyle.color}, ${statusStyle.border})`,
        }
      }}>
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: 'text.primary',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.project_name}
              </Typography>
              <Chip
                label={getStatusLabel(project.project_status)}
                sx={{
                  bgcolor: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                }}
              />
            </Box>
            <Box
              className="project-actions"
              sx={{
                opacity: 0,
                transform: 'translateY(-10px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                gap: 0.5,
              }}
            >
              <Tooltip title="عرض التفاصيل">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.100' }
                  }}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="تعديل">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/projects/${project.id}/edit`)}
                  sx={{
                    bgcolor: 'warning.50',
                    color: 'warning.main',
                    '&:hover': { bgcolor: 'warning.100' }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="حذف">
                <IconButton
                  size="small"
                  onClick={() => setDeleteDialog({ open: true, project })}
                  sx={{
                    bgcolor: 'error.50',
                    color: 'error.main',
                    '&:hover': { bgcolor: 'error.100' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Content */}
          <Box flex={1}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <BusinessIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {project.beneficiary_organization || 'غير محدد'}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {project.university_project_manager || 'غير محدد'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <MoneyIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {formatCurrency(project.project_cost)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {formatDate(project.project_start_date)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Footer */}
          <Box mt={2} pt={2} borderTop="1px solid" borderColor="divider">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                المعرف: {project.id}
              </Typography>
              <Button
                size="small"
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 2,
                }}
              >
                عرض التفاصيل
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="text" width={300} height={60} sx={{ mb: 4 }} />
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
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
                }}
              >
                إدارة المشاريع
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                نظرة شاملة على جميع المشاريع والإحصائيات
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/projects/new')}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              إنشاء مشروع جديد
            </Button>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي المشاريع"
                value={totalProjects}
                icon={<AssignmentIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                subtitle="جميع المشاريع المسجلة"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="مشاريع مكتملة"
                value={completedProjects}
                icon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                subtitle={`${totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}% من المشاريع`}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="قيد التنفيذ"
                value={inProgressProjects}
                icon={<ScheduleIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                subtitle="مشاريع نشطة حالياً"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي الميزانية"
                value={`${(totalBudget / 1000000).toFixed(1)}م ر.س`}
                icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                subtitle="القيمة الإجمالية للمشاريع"
              />
            </Grid>
          </Grid>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 3,
                border: '1px solid #fecaca',
                '& .MuiAlert-icon': {
                  fontSize: 24
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <Paper sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 4,
              border: '2px dashed #e2e8f0',
              bgcolor: '#fafafa'
            }}>
              <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                لا توجد مشاريع حالياً
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                ابدأ بإنشاء مشروعك الأول لإدارة المشاريع بكفاءة
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/projects/new')}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                إنشاء مشروع جديد
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} lg={4} key={project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, project: null })}
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
              <Typography variant="body1" color="text.secondary">
                "{deleteDialog.project?.project_name}"
              </Typography>
              <Typography variant="body2" color="error.main" sx={{ mt: 2, fontWeight: 500 }}>
                هذا الإجراء لا يمكن التراجع عنه
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={() => setDeleteDialog({ open: false, project: null })}
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
                onClick={() => handleDelete(deleteDialog.project?.id)}
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

export default ProjectsList;