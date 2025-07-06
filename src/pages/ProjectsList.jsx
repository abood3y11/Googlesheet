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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  Extension as ExtendIcon,
  Cancel as CancelProjectIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  TableChart as TableChartIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, project: null });
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'list', 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    totalBudget: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getAllProjects();
      setProjects(data);
      calculateStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projectsData) => {
    const stats = {
      total: projectsData.length,
      completed: projectsData.filter(p => p.project_status === 'completed').length,
      inProgress: projectsData.filter(p => p.project_status === 'in_progress').length,
      totalBudget: projectsData.reduce((sum, p) => sum + (parseFloat(p.project_cost) || 0), 0)
    };
    setStats(stats);
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.beneficiary_organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.executing_company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.project_status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleActionClick = (action) => {
    console.log(`Action: ${action} for project:`, actionMenu.project);
    setActionMenu({ anchorEl: null, project: null });
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

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'م';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'ك';
    }
    return num.toString();
  };

  const StatCard = ({ title, value, subtitle, icon, gradient }) => (
    <Card sx={{
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      height: '100%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
      }
    }}>
      <Box sx={{
        background: gradient,
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
        <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                fontFamily: 'Sakkal Majalla',
                mb: 0.5,
                fontSize: { xs: '2rem', sm: '2.5rem' }
              }}
            >
              {typeof value === 'number' && value > 1000 ? formatNumber(value) : value}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla',
                opacity: 0.9
              }}
            >
              {title}
            </Typography>
          </Box>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            width: 56,
            height: 56
          }}>
            {icon}
          </Avatar>
        </Box>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 500,
            fontFamily: 'Sakkal Majalla'
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
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
        height: '100%',
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
                  fontFamily: 'Sakkal Majalla',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {project.project_name}
              </Typography>
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
            </Box>
            <IconButton
              onClick={(e) => setActionMenu({ anchorEl: e.currentTarget, project })}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontFamily: 'Sakkal Majalla',
                  fontSize: '0.875rem'
                }}
              >
                {project.beneficiary_organization}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontFamily: 'Sakkal Majalla',
                  fontSize: '0.875rem'
                }}
              >
                {project.university_project_manager}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontFamily: 'Sakkal Majalla',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {formatCurrency(project.project_cost)}
              </Typography>
            </Box>
          </Stack>

          <Box display="flex" gap={1} mt={3}>
            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla',
                fontSize: '0.75rem'
              }}
            >
              عرض
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/projects/${project.id}/edit`)}
              variant="outlined"
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla',
                fontSize: '0.75rem'
              }}
            >
              تعديل
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const columns = [
    {
      field: 'project_name',
      headerName: 'اسم المشروع',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: 'Sakkal Majalla', fontWeight: 600 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'project_status',
      headerName: 'الحالة',
      width: 120,
      renderCell: (params) => {
        const statusConfig = getStatusConfig(params.value);
        return (
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            sx={{
              bgcolor: statusConfig.bg,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.border}`,
              fontWeight: 600,
              fontSize: '0.75rem',
              fontFamily: 'Sakkal Majalla',
              '& .MuiChip-icon': {
                color: statusConfig.color
              }
            }}
          />
        );
      }
    },
    {
      field: 'beneficiary_organization',
      headerName: 'الجهة المستفيدة',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'project_cost',
      headerName: 'التكلفة',
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: 'Sakkal Majalla', fontWeight: 600 }}>
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => setActionMenu({ anchorEl: e.currentTarget, project: params.row })}
        >
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];

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

  if (error) {
    return (
      <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ py: 4 }}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              fontFamily: 'Sakkal Majalla',
              '& .MuiAlert-icon': { fontSize: 24 }
            }}
          >
            {error}
          </Alert>
          <Button
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
            variant="contained"
            sx={{ 
              borderRadius: 3,
              fontFamily: 'Sakkal Majalla'
            }}
          >
            إنشاء مشروع جديد
          </Button>
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
                fontFamily: 'Sakkal Majalla',
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
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي المشاريع"
                value={stats.total}
                subtitle="جميع المشاريع المسجلة"
                icon={<AssignmentIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="مشاريع مكتملة"
                value={stats.completed}
                subtitle="من إجمالي المشاريع"
                icon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="قيد التنفيذ"
                value={stats.inProgress}
                subtitle="مشاريع نشطة حالياً"
                icon={<ScheduleIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي الميزانية"
                value={formatCurrency(stats.totalBudget)}
                subtitle="القيمة الإجمالية للمشاريع"
                icon={<MoneyIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
              />
            </Grid>
          </Grid>

          {/* Search and Filters */}
          <Paper sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            mb: 4
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2} flex={1} flexWrap="wrap">
                <TextField
                  placeholder="البحث في المشاريع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: 300,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontFamily: 'Sakkal Majalla'
                    }
                  }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ fontFamily: 'Sakkal Majalla' }}>الحالة</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="الحالة"
                    sx={{
                      borderRadius: 3,
                      fontFamily: 'Sakkal Majalla'
                    }}
                  >
                    <MenuItem value="all">جميع الحالات</MenuItem>
                    <MenuItem value="planning">تخطيط</MenuItem>
                    <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
                    <MenuItem value="suspended">متوقف</MenuItem>
                    <MenuItem value="completed">مكتمل</MenuItem>
                    <MenuItem value="cancelled">ملغي</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 3,
                    border: '2px solid #e5e7eb',
                    color: 'text.secondary',
                    fontFamily: 'Sakkal Majalla',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="cards">
                  <ViewModuleIcon sx={{ mr: 1 }} />
                  البطاقات
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon sx={{ mr: 1 }} />
                  كامل
                </ToggleButton>
                <ToggleButton value="table">
                  <TableChartIcon sx={{ mr: 1 }} />
                  القائمة
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Paper>

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
              <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ 
                  mb: 1,
                  fontFamily: 'Sakkal Majalla',
                  fontWeight: 600
                }}
              >
                لا توجد مشاريع
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  mb: 3,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {searchTerm || statusFilter !== 'all' 
                  ? 'لا توجد مشاريع تطابق معايير البحث'
                  : 'ابدأ بإنشاء مشروعك الأول'
                }
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
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                إنشاء مشروع جديد
              </Button>
            </Box>
          ) : (
            <>
              {viewMode === 'cards' && (
                <Grid container spacing={3}>
                  {filteredProjects.map((project) => (
                    <Grid item xs={12} sm={6} lg={4} key={project.id}>
                      <ProjectCard project={project} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {viewMode === 'list' && (
                <Stack spacing={2}>
                  {filteredProjects.map((project) => (
                    <Card key={project.id} sx={{
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={3} flex={1}>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  mb: 0.5,
                                  fontFamily: 'Sakkal Majalla'
                                }}
                              >
                                {project.project_name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontFamily: 'Sakkal Majalla' }}
                              >
                                {project.beneficiary_organization}
                              </Typography>
                            </Box>
                            
                            <Chip
                              icon={getStatusConfig(project.project_status).icon}
                              label={getStatusConfig(project.project_status).label}
                              sx={{
                                bgcolor: getStatusConfig(project.project_status).bg,
                                color: getStatusConfig(project.project_status).color,
                                border: `1px solid ${getStatusConfig(project.project_status).border}`,
                                fontWeight: 600,
                                fontFamily: 'Sakkal Majalla'
                              }}
                            />
                            
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600,
                                fontFamily: 'Sakkal Majalla'
                              }}
                            >
                              {formatCurrency(project.project_cost)}
                            </Typography>
                          </Box>

                          <Box display="flex" gap={1}>
                            <Tooltip title="عرض التفاصيل">
                              <IconButton
                                onClick={() => navigate(`/projects/${project.id}`)}
                                sx={{ color: 'primary.main' }}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="تعديل">
                              <IconButton
                                onClick={() => navigate(`/projects/${project.id}/edit`)}
                                sx={{ color: 'warning.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <IconButton
                              onClick={(e) => setActionMenu({ anchorEl: e.currentTarget, project })}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}

              {viewMode === 'table' && (
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <DataGrid
                    rows={filteredProjects}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    autoHeight
                    sx={{
                      border: 'none',
                      '& .MuiDataGrid-columnHeaders': {
                        bgcolor: 'grey.50',
                        fontFamily: 'Sakkal Majalla',
                        fontWeight: 700
                      },
                      '& .MuiDataGrid-cell': {
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Paper>
              )}
            </>
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