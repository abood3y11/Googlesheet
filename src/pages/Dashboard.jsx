import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fade,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { projectsAPI } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    planning: 0,
    suspended: 0,
    cancelled: 0,
    totalBudget: 0,
    averageBudget: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

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
      planning: projectsData.filter(p => p.project_status === 'planning').length,
      suspended: projectsData.filter(p => p.project_status === 'suspended').length,
      cancelled: projectsData.filter(p => p.project_status === 'cancelled').length,
      totalBudget: projectsData.reduce((sum, p) => sum + (parseFloat(p.project_cost) || 0), 0),
      averageBudget: 0
    };
    
    stats.averageBudget = stats.total > 0 ? stats.totalBudget / stats.total : 0;
    setStats(stats);
  };

  const formatCurrency = (amount) => {
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

  const StatCard = ({ title, value, subtitle, icon, gradient, percentage, trend }) => (
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
            fontFamily: 'Sakkal Majalla',
            mb: percentage ? 2 : 0
          }}
        >
          {subtitle}
        </Typography>
        {percentage && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {percentage}% من إجمالي المشاريع
              </Typography>
              {trend && (
                <Chip 
                  label={trend} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'success.50',
                    color: 'success.main',
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla'
                  }} 
                />
              )}
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={percentage} 
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: gradient
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

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
              جاري تحميل بيانات الداشبورد...
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
              borderRadius: 3,
              fontFamily: 'Sakkal Majalla',
              '& .MuiAlert-icon': { fontSize: 24 }
            }}
          >
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box mb={4}>
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
                percentage={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
                trend="+17%"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="قيد التنفيذ"
                value={stats.inProgress}
                subtitle="مشاريع نشطة حالياً"
                icon={<ScheduleIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                percentage={stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي الميزانية"
                value={formatCurrency(stats.totalBudget)}
                subtitle="القيمة الإجمالية للمشاريع"
                icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
              />
            </Grid>
          </Grid>

          {/* Additional Statistics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="في مرحلة التخطيط"
                value={stats.planning}
                subtitle="مشاريع قيد التخطيط"
                icon={<BusinessIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                percentage={stats.total > 0 ? Math.round((stats.planning / stats.total) * 100) : 0}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="مشاريع متوقفة"
                value={stats.suspended}
                subtitle="مشاريع مؤقتة التوقف"
                icon={<WarningIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                percentage={stats.total > 0 ? Math.round((stats.suspended / stats.total) * 100) : 0}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <StatCard
                title="متوسط الميزانية"
                value={formatCurrency(stats.averageBudget)}
                subtitle="متوسط تكلفة المشروع"
                icon={<MoneyIcon sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fade>
  );
};

export default Dashboard;