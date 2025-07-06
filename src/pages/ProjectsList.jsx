import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fade,
  Tooltip,
  Stack,
  Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  AccessTime as ExtendIcon,
  CancelPresentation as CancelProjectIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, project: null });

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

  const handleActionClick = (action) => {
    console.log(`Action: ${action} for project:`, actionMenu.project);
    setActionMenu({ anchorEl: null, project: null });
    // Implement action logic here
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
        icon: <CancelIcon />,
        label: 'ملغي'
      },
    };
    return statusConfigs[status] || statusConfigs.planning;
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
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.beneficiary_organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.executing_company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.project_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectStats = () => {
    const stats = {
      total: projects.length,
      planning: projects.filter(p => p.project_status === 'planning').length,
      in_progress: projects.filter(p => p.project_status === 'in_progress').length,
      completed: projects.filter(p => p.project_status === 'completed').length,
      suspended: projects.filter(p => p.project_status === 'suspended').length,
      cancelled: projects.filter(p => p.project_status === 'cancelled').length,
      totalCost: projects.reduce((sum, p) => sum + (p.project_cost || 0), 0)
    };
    return stats;
  };

  const stats = getProjectStats();

  const StatCard = ({ title, value, icon, color, gradient }) => (
    <Card sx={{
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
        background: gradient || `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        p: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: `${color}15`,
          borderRadius: '50%',
          transform: 'translate(20px, -20px)',
        }
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: color,
                mb: 0.5,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {typeof value === 'number' && title.includes('التكلفة') ? formatCurrency(value) : value}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {title}
            </Typography>
          </Box>
          <Avatar sx={{
            bgcolor: `${color}20`,
            color: color,
            width: 56,
            height: 56
          }}>
            {icon}
          </Avatar>
        </Box>
      </Box>
    </Card>
  );

  const ProjectCard = ({ project }) => {
    const statusConfig = getStatusConfig(project.project_status);
    
    return (
      <Card sx={{
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
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  color: 'text.primary',
                  fontFamily: 'Sakkal Majalla',
                  lineHeight: 1.3
                }}
              >
                {project.project_name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {project.beneficiary_organization}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                sx={{
                  bgcolor: statusConfig.bg,
                  color: statusConfig.color,
                  border: `1px solid ${statusConfig.border}`,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  fontFamily: 'Sakkal Majalla',
                  '& .MuiChip-icon': {
                    color: statusConfig.color
                  }
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => setActionMenu({ anchorEl: e.currentTarget, project })}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    color: 'primary.main'
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: 'Sakkal Majalla' }}
              >
                التكلفة
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {formatCurrency(project.project_cost)}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: 'Sakkal Majalla' }}
              >
                تاريخ البداية
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {formatDate(project.project_start_date)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={1} justifyContent="flex-end">
            <Tooltip title="عرض التفاصيل">
              <IconButton
                size="small"
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.100'
                  }
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
                  '&:hover': {
                    bgcolor: 'warning.100'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
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
              جاري تحميل المشاريع...
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
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4} flexWrap="wrap" gap={2}>
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
                  fontFamily: 'Sakkal Majalla',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                إدارة المشاريع
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 500,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                عرض وإدارة جميع مشاريع الجامعة
              </Typography>
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchProjects}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'primary.300',
                  color: 'primary.main',
                  fontFamily: 'Sakkal Majalla',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main'
                  }
                }}
              >
                تحديث
              </Button>
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
                  fontFamily: 'Sakkal Majalla',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                مشروع جديد
              </Button>
            </Box>
          </Box>

          {/* Error Alert */}
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

          {/* Statistics Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="إجمالي المشاريع"
                value={stats.total}
                icon={<BusinessIcon />}
                color="#667eea"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="قيد التنفيذ"
                value={stats.in_progress}
                icon={<TrendingUpIcon />}
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="مكتملة"
                value={stats.completed}
                icon={<CheckCircleIcon />}
                color="#8b5cf6"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="إجمالي التكلفة"
                value={stats.totalCost}
                icon={<MoneyIcon />}
                color="#f59e0b"
              />
            </Grid>
          </Grid>

          {/* Filters */}
          <Paper sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            mb: 4
          }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="البحث في المشاريع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: 'Sakkal Majalla'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="تصفية حسب الحالة"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: 'Sakkal Majalla'
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: 'Sakkal Majalla'
                    }
                  }}
                >
                  <MenuItem value="all">جميع الحالات</MenuItem>
                  <MenuItem value="planning">تخطيط</MenuItem>
                  <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
                  <MenuItem value="suspended">متوقف</MenuItem>
                  <MenuItem value="completed">مكتمل</MenuItem>
                  <MenuItem value="cancelled">ملغي</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Box 
              sx={{
                textAlign: 'center',
                py: 8,
                border: '2px dashed #d1d5db',
                borderRadius: 4,
                bgcolor: '#f9fafb'
              }}
            >
              <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ 
                  mb: 1,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {searchTerm || statusFilter !== 'all' ? 'لا توجد مشاريع تطابق البحث' : 'لا توجد مشاريع'}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  mb: 3,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {searchTerm || statusFilter !== 'all' ? 'جرب تغيير معايير البحث' : 'ابدأ بإنشاء مشروع جديد'}
              </Typography>
              {!searchTerm && statusFilter === 'all' && (
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
                    fontFamily: 'Sakkal Majalla'
                  }}
                >
                  إنشاء مشروع جديد
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProjects.map((project) => (
                <Grid item xs={12} sm={6} lg={4} key={project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Action Menu */}
          <Menu
            anchorEl={actionMenu.anchorEl}
            open={Boolean(actionMenu.anchorEl)}
            onClose={() => setActionMenu({ anchorEl: null, project: null })}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {actionMenu.project?.project_status !== 'suspended' && 
             actionMenu.project?.project_status !== 'completed' && 
             actionMenu.project?.project_status !== 'cancelled' && (
              <MenuItem onClick={() => handleActionClick('suspend')}>
                <ListItemIcon>
                  <PauseIcon sx={{ color: '#f59e0b' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="إيقاف المشروع" 
                  sx={{ '& .MuiTypography-root': { fontFamily: 'Sakkal Majalla' } }}
                />
              </MenuItem>
            )}
            
            {actionMenu.project?.project_status === 'suspended' && (
              <MenuItem onClick={() => handleActionClick('resume')}>
                <ListItemIcon>
                  <ResumeIcon sx={{ color: '#10b981' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="استئناف المشروع"
                  sx={{ '& .MuiTypography-root': { fontFamily: 'Sakkal Majalla' } }}
                />
              </MenuItem>
            )}
            
            {(actionMenu.project?.project_status === 'in_progress' || 
              actionMenu.project?.project_status === 'planning') && (
              <MenuItem onClick={() => handleActionClick('extend')}>
                <ListItemIcon>
                  <ExtendIcon sx={{ color: '#06b6d4' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="تمديد المشروع"
                  sx={{ '& .MuiTypography-root': { fontFamily: 'Sakkal Majalla' } }}
                />
              </MenuItem>
            )}
            
            {actionMenu.project?.project_status !== 'completed' && 
             actionMenu.project?.project_status !== 'cancelled' && (
              <>
                <Divider />
                <MenuItem onClick={() => handleActionClick('cancel')}>
                  <ListItemIcon>
                    <CancelProjectIcon sx={{ color: '#ef4444' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="إلغاء المشروع" 
                    sx={{ '& .MuiTypography-root': { fontFamily: 'Sakkal Majalla' } }}
                  />
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectsList;