import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Stack,
  Fade,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ViewModule as CardViewIcon,
  ViewKanban as KanbanViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards');

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
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      try {
        await projectsAPI.deleteProject(projectId);
        await fetchProjects();
      } catch (err) {
        setError(err.message);
      }
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

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.beneficiary_organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.university_project_manager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.executing_company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm('');
  };

  const ProjectCard = ({ project }) => {
    const statusConfig = getStatusConfig(project.project_status);

    return (
      <Fade in={true} timeout={600}>
        <Card sx={{
          height: '100%',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          }
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            position: 'relative',
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
            <Box display="flex" alignItems="center" gap={2} position="relative" zIndex={1}>
              <Avatar sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                width: 56,
                height: 56
              }}>
                <BusinessIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box flex={1}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 0.5,
                    fontFamily: 'Sakkal Majalla',
                    lineHeight: 1.3
                  }}
                >
                  {project.project_name}
                </Typography>
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={2}>
                <BusinessIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    الجهة المستفيدة
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    {project.beneficiary_organization || 'غير محدد'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <PersonIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    مدير المشروع
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    {project.university_project_manager || 'غير محدد'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <MoneyIcon sx={{ color: 'success.main', fontSize: 20 }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    التكلفة
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'success.main',
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    {formatCurrency(project.project_cost)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <ScheduleIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    تاريخ البداية
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    {formatDate(project.project_start_date)}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Box display="flex" gap={1} mt={3} justifyContent="flex-end">
              <Tooltip title="عرض التفاصيل">
                <IconButton
                  onClick={() => navigate(`/projects/${project.id}`)}
                  sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.100',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="تعديل">
                <IconButton
                  onClick={() => navigate(`/projects/${project.id}/edit`)}
                  sx={{
                    bgcolor: 'warning.50',
                    color: 'warning.main',
                    '&:hover': {
                      bgcolor: 'warning.100',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="حذف">
                <IconButton
                  onClick={() => handleDelete(project.id)}
                  sx={{
                    bgcolor: 'error.50',
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.100',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  const ProjectListItem = ({ project }) => {
    const statusConfig = getStatusConfig(project.project_status);

    return (
      <Paper sx={{
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        }
      }}>
        <ListItem sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mr={2}>
            <Avatar sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48
            }}>
              <BusinessIcon />
            </Avatar>
          </Box>
          <ListItemText
            primary={
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: 'Sakkal Majalla'
                  }}
                >
                  {project.project_name}
                </Typography>
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  size="small"
                  sx={{
                    bgcolor: statusConfig.bg,
                    color: statusConfig.color,
                    border: `1px solid ${statusConfig.border}`,
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla',
                    '& .MuiChip-icon': {
                      color: statusConfig.color
                    }
                  }}
                />
              </Box>
            }
            secondary={
              <Box display="flex" gap={4} flexWrap="wrap">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Sakkal Majalla',
                    color: 'text.secondary'
                  }}
                >
                  <strong>الجهة المستفيدة:</strong> {project.beneficiary_organization || 'غير محدد'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Sakkal Majalla',
                    color: 'text.secondary'
                  }}
                >
                  <strong>مدير المشروع:</strong> {project.university_project_manager || 'غير محدد'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Sakkal Majalla',
                    color: 'success.main',
                    fontWeight: 600
                  }}
                >
                  <strong>التكلفة:</strong> {formatCurrency(project.project_cost)}
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <Box display="flex" gap={1}>
              <Tooltip title="عرض التفاصيل">
                <IconButton
                  onClick={() => navigate(`/projects/${project.id}`)}
                  sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.100'
                    }
                  }}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="تعديل">
                <IconButton
                  onClick={() => navigate(`/projects/${project.id}/edit`)}
                  sx={{
                    bgcolor: 'warning.50',
                    color: 'warning.main',
                    '&:hover': {
                      bgcolor: 'warning.100'
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="حذف">
                <IconButton
                  onClick={() => handleDelete(project.id)}
                  sx={{
                    bgcolor: 'error.50',
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.100'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      </Paper>
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
                عرض وإدارة جميع المشاريع في النظام
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
                fontFamily: 'Sakkal Majalla',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              إضافة مشروع جديد
            </Button>
          </Box>

          {/* Search Field */}
          <Box display="flex" justifyContent="center" mb={3}>
            <TextField
              fullWidth
              placeholder="البحث في المشاريع (اسم المشروع، الجهة المستفيدة، مدير المشروع، الشركة المنفذة...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: 600,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  fontFamily: 'Sakkal Majalla',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.2)',
                    borderColor: 'primary.main',
                  }
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Sakkal Majalla',
                  fontSize: '1rem',
                  py: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={clearSearch}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'error.main',
                          bgcolor: 'error.50'
                        }
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* View Toggle */}
          <Box display="flex" justifyContent="center" mb={4}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newView) => newView && setViewMode(newView)}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '12px !important',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="cards">
                <CardViewIcon sx={{ mr: 1 }} />
                البطاقات
              </ToggleButton>
              <ToggleButton value="kanban">
                <KanbanViewIcon sx={{ mr: 1 }} />
                كانبان
              </ToggleButton>
              <ToggleButton value="list">
                <ListViewIcon sx={{ mr: 1 }} />
                القائمة
              </ToggleButton>
            </ToggleButtonGroup>
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

          {/* Search Results Info */}
          {searchTerm && (
            <Box mb={3}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'Sakkal Majalla',
                  color: 'text.secondary',
                  textAlign: 'center'
                }}
              >
                تم العثور على {filteredProjects.length} مشروع من أصل {projects.length} مشروع
              </Typography>
            </Box>
          )}

          {/* Projects Display */}
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
                  mb: 2,
                  fontFamily: 'Sakkal Majalla',
                  fontWeight: 600
                }}
              >
                {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد مشاريع'}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  mb: 3,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {searchTerm 
                  ? `لم يتم العثور على مشاريع تحتوي على "${searchTerm}"`
                  : 'ابدأ بإضافة مشروع جديد لعرضه هنا'
                }
              </Typography>
              {searchTerm ? (
                <Button
                  variant="outlined"
                  onClick={clearSearch}
                  startIcon={<ClearIcon />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla'
                  }}
                >
                  مسح البحث
                </Button>
              ) : (
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
                    fontFamily: 'Sakkal Majalla',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    }
                  }}
                >
                  إضافة مشروع جديد
                </Button>
              )}
            </Box>
          ) : (
            <>
              {/* Cards View */}
              {viewMode === 'cards' && (
                <Grid container spacing={3}>
                  {filteredProjects.map((project) => (
                    <Grid item xs={12} sm={6} lg={4} key={project.id}>
                      <ProjectCard project={project} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <List sx={{ bgcolor: 'transparent' }}>
                  {filteredProjects.map((project, index) => (
                    <React.Fragment key={project.id}>
                      <ProjectListItem project={project} />
                      {index < filteredProjects.length - 1 && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {/* Kanban View - Placeholder */}
              {viewMode === 'kanban' && (
                <Box 
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    border: '2px dashed #d1d5db',
                    borderRadius: 4,
                    bgcolor: '#f9fafb'
                  }}
                >
                  <KanbanViewIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontFamily: 'Sakkal Majalla',
                      fontWeight: 600
                    }}
                  >
                    عرض كانبان
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ fontFamily: 'Sakkal Majalla' }}
                  >
                    سيتم تطوير هذا العرض قريباً
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectsList;