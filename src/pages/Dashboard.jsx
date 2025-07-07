import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Fade,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as ProjectsIcon,
  CheckCircle as CompletedIcon,
  Schedule as InProgressIcon,
  Warning as SuspendedIcon,
  Cancel as CancelledIcon,
  Info as PlanningIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  AccountBalance as BudgetIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import mockData from '../data/mockData.json';
import ProjectCommands from '../components/ProjectCommands';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects] = useState(mockData.projects);
  const [stats] = useState(mockData.statistics);
  const [selectedProject, setSelectedProject] = useState(null);
  const [commandsDialog, setCommandsDialog] = useState(false);

  // Calculate dynamic statistics
  const statusCounts = {
    planning: projects.filter(p => p.project_status === 'planning').length,
    in_progress: projects.filter(p => p.project_status === 'in_progress').length,
    completed: projects.filter(p => p.project_status === 'completed').length,
    suspended: projects.filter(p => p.project_status === 'suspended').length,
    cancelled: projects.filter(p => p.project_status === 'cancelled').length,
  };

  const pieData = [
    { name: 'قيد التنفيذ', value: statusCounts.in_progress, color: '#10b981' },
    { name: 'تخطيط', value: statusCounts.planning, color: '#3b82f6' },
    { name: 'مكتمل', value: statusCounts.completed, color: '#8b5cf6' },
    { name: 'متوقف', value: statusCounts.suspended, color: '#f59e0b' },
    { name: 'ملغي', value: statusCounts.cancelled, color: '#ef4444' },
  ];

  const budgetData = projects.map(project => ({
    name: project.project_name.substring(0, 20) + '...',
    budget: project.project_cost / 1000, // Convert to thousands
    status: project.project_status
  }));

  const timelineData = projects.map(project => ({
    name: project.project_name.substring(0, 15) + '...',
    duration: project.project_duration_days,
    planned: project.project_duration_days,
    actual: project.actual_project_end_date ? 
      Math.ceil((new Date(project.actual_project_end_date) - new Date(project.project_start_date)) / (1000 * 60 * 60 * 24)) : 
      project.project_duration_days
  }));

  const handleProjectUpdate = async (updatedProject) => {
    try {
      // In a real app, this would update the backend
      // For now, we'll just close the dialog
      setCommandsDialog(false);
      setSelectedProject(null);
      // You could also update the local state here if needed
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const openProjectCommands = (project) => {
    setSelectedProject(project);
    setCommandsDialog(true);
  };

  const StatCard = ({ title, value, subtitle, icon, color, gradient, trend }) => (
    <Card sx={{
      height: '100%',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
      }
    }}>
      <Box sx={{
        background: gradient || `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
        p: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: `${color}20`,
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
                color: color,
                mb: 0.5,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {value}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Avatar sx={{
            bgcolor: color,
            width: 64,
            height: 64,
            boxShadow: `0 8px 24px ${color}40`
          }}>
            {icon}
          </Avatar>
        </Box>
        {trend && (
          <Box display="flex" alignItems="center" gap={1} mt={2} position="relative" zIndex={1}>
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'success.main',
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );

  const ChartCard = ({ title, children, height = 300 }) => (
    <Card sx={{
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      overflow: 'hidden'
    }}>
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            fontFamily: 'Sakkal Majalla'
          }}
        >
          {title}
        </Typography>
      </Box>
      <CardContent sx={{ p: 3, height }}>
        {children}
      </CardContent>
    </Card>
  );

  const RecentProjectItem = ({ project }) => {
    const getStatusColor = (status) => {
      const colors = {
        planning: '#3b82f6',
        in_progress: '#10b981',
        completed: '#8b5cf6',
        suspended: '#f59e0b',
        cancelled: '#ef4444'
      };
      return colors[status] || '#6b7280';
    };

    const getStatusLabel = (status) => {
      const labels = {
        planning: 'تخطيط',
        in_progress: 'قيد التنفيذ',
        completed: 'مكتمل',
        suspended: 'متوقف',
        cancelled: 'ملغي'
      };
      return labels[status] || status;
    };

    return (
      <ListItem sx={{
        borderRadius: 3,
        mb: 1,
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'primary.50',
          borderColor: 'primary.200',
          transform: 'translateX(-4px)'
        }
      }}>
        <ListItemAvatar>
          <Avatar sx={{
            bgcolor: getStatusColor(project.project_status),
            width: 48,
            height: 48
          }}>
            <BusinessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla',
                mb: 0.5
              }}
            >
              {project.project_name}
            </Typography>
          }
          secondary={
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontFamily: 'Sakkal Majalla',
                  mb: 0.5
                }}
              >
                {project.beneficiary_organization}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={getStatusLabel(project.project_status)}
                  size="small"
                  sx={{
                    bgcolor: `${getStatusColor(project.project_status)}20`,
                    color: getStatusColor(project.project_status),
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla'
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'success.main',
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla'
                  }}
                >
                  {new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: 'SAR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(project.project_cost)}
                </Typography>
                <Tooltip title="أوامر التغيير">
                  <IconButton
                    onClick={() => openProjectCommands(project)}
                    sx={{
                      bgcolor: 'info.50',
                      color: 'info.main',
                      ml: 1,
                      '&:hover': {
                        bgcolor: 'info.100',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <ScheduleIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          }
        />
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
      </ListItem>
    );
  };

  return (
    <Fade in={true} timeout={800}>
      <div>
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
                لوحة التحكم
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

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<AnalyticsIcon />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                التقارير
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

          {/* Statistics Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي المشاريع"
                value={projects.length}
                subtitle="جميع المشاريع في النظام"
                icon={<ProjectsIcon sx={{ fontSize: 32 }} />}
                color="#667eea"
                trend="+12% من الشهر الماضي"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="قيد التنفيذ"
                value={statusCounts.in_progress}
                subtitle="مشاريع نشطة حالياً"
                icon={<InProgressIcon sx={{ fontSize: 32 }} />}
                color="#10b981"
                trend="+5% من الأسبوع الماضي"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="مكتملة"
                value={statusCounts.completed}
                subtitle="مشاريع تم إنجازها"
                icon={<CompletedIcon sx={{ fontSize: 32 }} />}
                color="#8b5cf6"
                trend="+8% من الشهر الماضي"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي الميزانية"
                value={`${(projects.reduce((sum, p) => sum + p.project_cost, 0) / 1000000).toFixed(1)}م`}
                subtitle="ريال سعودي"
                icon={<BudgetIcon sx={{ fontSize: 32 }} />}
                color="#f59e0b"
                trend="+15% من الربع الماضي"
              />
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} mb={4}>
            {/* Project Status Distribution */}
            <Grid item xs={12} lg={6}>
              <ChartCard title="توزيع حالات المشاريع" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name) => [`${value} مشروع`, name]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontFamily: 'Sakkal Majalla'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mt={2}>
                  {pieData.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: item.color
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontFamily: 'Sakkal Majalla',
                          fontWeight: 500
                        }}
                      >
                        {item.name} ({item.value})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </ChartCard>
            </Grid>

            {/* Budget Analysis */}
            <Grid item xs={12} lg={6}>
              <ChartCard title="تحليل الميزانيات" height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fontFamily: 'Sakkal Majalla' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fontFamily: 'Sakkal Majalla' }}
                      label={{ value: 'الميزانية (بالآلاف)', angle: -90, position: 'insideLeft' }}
                    />
                    <RechartsTooltip 
                      formatter={(value) => [`${value}k ريال`, 'الميزانية']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontFamily: 'Sakkal Majalla'
                      }}
                    />
                    <Bar 
                      dataKey="budget" 
                      fill="url(#budgetGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Timeline Analysis */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12}>
              <ChartCard title="تحليل الجدول الزمني للمشاريع" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fontFamily: 'Sakkal Majalla' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fontFamily: 'Sakkal Majalla' }}
                      label={{ value: 'المدة (بالأيام)', angle: -90, position: 'insideLeft' }}
                    />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        `${value} يوم`, 
                        name === 'planned' ? 'المدة المخططة' : 'المدة الفعلية'
                      ]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontFamily: 'Sakkal Majalla'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="planned" 
                      stackId="1"
                      stroke="#667eea" 
                      fill="url(#plannedGradient)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      stackId="2"
                      stroke="#10b981" 
                      fill="url(#actualGradient)"
                    />
                    <defs>
                      <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Recent Projects and Quick Actions */}
          <Grid container spacing={3}>
            {/* Recent Projects */}
            <Grid item xs={12} lg={8}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 3
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        fontFamily: 'Sakkal Majalla'
                      }}
                    >
                      المشاريع الحديثة
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/projects')}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        fontFamily: 'Sakkal Majalla',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      عرض الكل
                    </Button>
                  </Box>
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <List sx={{ p: 2 }}>
                    {projects.slice(0, 4).map((project) => (
                      <RecentProjectItem key={project.id} project={project} />
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions & Summary */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Quick Actions */}
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    p: 3
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        fontFamily: 'Sakkal Majalla'
                      }}
                    >
                      إجراءات سريعة
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/projects/new')}
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 600,
                          fontFamily: 'Sakkal Majalla'
                        }}
                      >
                        إضافة مشروع جديد
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ProjectsIcon />}
                        onClick={() => navigate('/projects')}
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 600,
                          fontFamily: 'Sakkal Majalla'
                        }}
                      >
                        عرض جميع المشاريع
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AnalyticsIcon />}
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 600,
                          fontFamily: 'Sakkal Majalla'
                        }}
                      >
                        تقارير مفصلة
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    p: 3
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        fontFamily: 'Sakkal Majalla'
                      }}
                    >
                      ملخص الأداء
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              fontFamily: 'Sakkal Majalla'
                            }}
                          >
                            معدل الإنجاز
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 700,
                              color: 'success.main',
                              fontFamily: 'Sakkal Majalla'
                            }}
                          >
                            {Math.round((statusCounts.completed / projects.length) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(statusCounts.completed / projects.length) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                            }
                          }}
                        />
                      </Box>

                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              fontFamily: 'Sakkal Majalla'
                            }}
                          >
                            المشاريع النشطة
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 700,
                              color: 'primary.main',
                              fontFamily: 'Sakkal Majalla'
                            }}
                          >
                            {Math.round((statusCounts.in_progress / projects.length) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(statusCounts.in_progress / projects.length) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                            }
                          }}
                        />
                      </Box>

                      <Divider />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            fontFamily: 'Sakkal Majalla'
                          }}
                        >
                          متوسط التكلفة
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700,
                            color: 'warning.main',
                            fontFamily: 'Sakkal Majalla'
                          }}
                        >
                          {new Intl.NumberFormat('ar-SA', {
                            style: 'currency',
                            currency: 'SAR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(projects.reduce((sum, p) => sum + p.project_cost, 0) / projects.length)}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            fontFamily: 'Sakkal Majalla'
                          }}
                        >
                          متوسط المدة
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700,
                            color: 'info.main',
                            fontFamily: 'Sakkal Majalla'
                          }}
                        >
                          {Math.round(projects.reduce((sum, p) => sum + p.project_duration_days, 0) / projects.length)} يوم
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
      </div>

      {/* Project Commands Dialog */}
      {commandsDialog && selectedProject && (
        <ProjectCommands
          project={selectedProject}
          onUpdate={handleProjectUpdate}
          onClose={() => {
            setCommandsDialog(false);
            setSelectedProject(null);
          }}
        />
      )}
    </Fade>
  );
};

export default Dashboard;