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
  IconButton,
  Tooltip,
  Paper,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  Update as ExtendIcon,
  MoreVert as MoreVertIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null });
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', project: null });
  const [actionData, setActionData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  // Fake data for demonstration
  const fakeProjects = [
    {
      id: 1,
      project_name: "مشروع تطوير نظام إدارة المشاريع",
      beneficiary_organization: "جامعة الملك سعود",
      university_project_manager: "د. أحمد محمد السعيد",
      technical_responsible_beneficiary: "م. سارة أحمد الزهراني",
      university_project_team: "فريق التطوير التقني",
      executing_company_name: "شركة التقنية المتقدمة",
      executing_company_project_manager: "م. محمد علي الأحمد",
      executing_company_representative: "أ. فاطمة سالم القحطاني",
      authorization_number: "AUTH-2024-001",
      project_authorization_date: "2024-01-15",
      project_cost: 850000,
      purchase_order_number: "PO-2024-001",
      charter_preparation_date: "2024-01-10",
      project_start_date: "2024-02-01",
      type_of_project_start: "immediate",
      project_duration_days: 180,
      planned_project_end_date: "2024-07-30",
      actual_project_end_date: null,
      site_handover_date: "2024-01-25",
      contract_signing_date: "2024-01-20",
      project_status: "in_progress",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "مشروع تطوير نظام إدارة المشاريع الجامعية"
    },
    {
      id: 2,
      project_name: "مشروع تطوير منصة التعلم الإلكتروني",
      beneficiary_organization: "جامعة الملك فهد للبترول والمعادن",
      university_project_manager: "د. خالد عبدالله النمر",
      technical_responsible_beneficiary: "م. نورا محمد الشهري",
      university_project_team: "فريق التعلم الإلكتروني",
      executing_company_name: "شركة الحلول الذكية",
      executing_company_project_manager: "م. عبدالرحمن صالح",
      executing_company_representative: "أ. هند عبدالعزيز",
      authorization_number: "AUTH-2024-002",
      project_authorization_date: "2024-02-01",
      project_cost: 1200000,
      purchase_order_number: "PO-2024-002",
      charter_preparation_date: "2024-01-25",
      project_start_date: "2024-03-01",
      type_of_project_start: "scheduled",
      project_duration_days: 240,
      planned_project_end_date: "2024-10-28",
      actual_project_end_date: null,
      site_handover_date: "2024-02-15",
      contract_signing_date: "2024-02-10",
      project_status: "planning",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "منصة تعلم إلكتروني متطورة مع ذكاء اصطناعي"
    },
    {
      id: 3,
      project_name: "مشروع تطوير نظام إدارة المكتبات",
      beneficiary_organization: "جامعة الإمام محمد بن سعود الإسلامية",
      university_project_manager: "د. عبدالله محمد الراشد",
      technical_responsible_beneficiary: "م. ريم أحمد العتيبي",
      university_project_team: "فريق المكتبات الرقمية",
      executing_company_name: "شركة النظم المتكاملة",
      executing_company_project_manager: "م. يوسف عبدالرحمن",
      executing_company_representative: "أ. مريم سعد الدوسري",
      authorization_number: "AUTH-2024-003",
      project_authorization_date: "2024-01-20",
      project_cost: 650000,
      purchase_order_number: "PO-2024-003",
      charter_preparation_date: "2024-01-15",
      project_start_date: "2024-02-15",
      type_of_project_start: "immediate",
      project_duration_days: 150,
      planned_project_end_date: "2024-07-15",
      actual_project_end_date: "2024-07-10",
      site_handover_date: "2024-02-01",
      contract_signing_date: "2024-01-30",
      project_status: "completed",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "نظام إدارة مكتبات رقمي شامل"
    },
    {
      id: 4,
      project_name: "مشروع تطوير تطبيق الخدمات الطلابية",
      beneficiary_organization: "جامعة الملك عبدالعزيز",
      university_project_manager: "د. فهد سليمان الغامدي",
      technical_responsible_beneficiary: "م. لينا محمد الحربي",
      university_project_team: "فريق الخدمات الطلابية",
      executing_company_name: "شركة التطبيقات الذكية",
      executing_company_project_manager: "م. أحمد عبدالله",
      executing_company_representative: "أ. نوف محمد القرني",
      authorization_number: "AUTH-2024-004",
      project_authorization_date: "2024-03-01",
      project_cost: 450000,
      purchase_order_number: "PO-2024-004",
      charter_preparation_date: "2024-02-25",
      project_start_date: "2024-03-15",
      type_of_project_start: "conditional",
      project_duration_days: 120,
      planned_project_end_date: "2024-07-15",
      actual_project_end_date: null,
      site_handover_date: "2024-03-10",
      contract_signing_date: "2024-03-05",
      project_status: "suspended",
      project_suspension_date: "2024-05-01",
      suspension_duration: 30,
      project_resumption_date: null,
      notes: "تطبيق موبايل للخدمات الطلابية"
    },
    {
      id: 5,
      project_name: "مشروع تطوير نظام إدارة الموارد البشرية",
      beneficiary_organization: "جامعة الأميرة نورة بنت عبدالرحمن",
      university_project_manager: "د. نادية عبدالله الصالح",
      technical_responsible_beneficiary: "م. أمل سعد المطيري",
      university_project_team: "فريق الموارد البشرية",
      executing_company_name: "شركة الأنظمة المتطورة",
      executing_company_project_manager: "م. سعد محمد العنزي",
      executing_company_representative: "أ. رنا عبدالعزيز الشمري",
      authorization_number: "AUTH-2024-005",
      project_authorization_date: "2024-02-15",
      project_cost: 750000,
      purchase_order_number: "PO-2024-005",
      charter_preparation_date: "2024-02-10",
      project_start_date: "2024-04-01",
      type_of_project_start: "scheduled",
      project_duration_days: 200,
      planned_project_end_date: "2024-10-20",
      actual_project_end_date: null,
      site_handover_date: "2024-03-25",
      contract_signing_date: "2024-03-20",
      project_status: "cancelled",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "نظام شامل لإدارة الموارد البشرية - تم إلغاؤه لأسباب إدارية"
    }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Use fake data instead of API call
      setTimeout(() => {
        setProjects(fakeProjects);
        setError(null);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
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

  const handleActionMenuClick = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const openActionDialog = (type) => {
    setActionDialog({ open: true, type, project: selectedProject });
    setActionData({});
    handleActionMenuClose();
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, type: '', project: null });
    setActionData({});
  };

  const handleActionSubmit = () => {
    // Here you would normally send the action data to your backend
    console.log('Action submitted:', {
      type: actionDialog.type,
      projectId: actionDialog.project?.id,
      data: actionData
    });
    
    // Update project status locally for demonstration
    const updatedProjects = projects.map(project => {
      if (project.id === actionDialog.project?.id) {
        const updatedProject = { ...project };
        
        switch (actionDialog.type) {
          case 'suspend':
            updatedProject.project_status = 'suspended';
            updatedProject.project_suspension_date = actionData.suspension_date;
            updatedProject.suspension_duration = actionData.suspension_duration;
            break;
          case 'resume':
            updatedProject.project_status = 'in_progress';
            updatedProject.project_resumption_date = actionData.resumption_date;
            break;
          case 'extend':
            updatedProject.planned_project_end_date = actionData.extension_end_date;
            break;
          case 'cancel':
            updatedProject.project_status = 'cancelled';
            break;
        }
        
        return updatedProject;
      }
      return project;
    });
    
    setProjects(updatedProjects);
    closeActionDialog();
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
      height: '160px',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transform: 'translate(40px, -40px)',
      }
    }}>
      <CardContent sx={{ 
        position: 'relative', 
        zIndex: 1, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 3
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              mb: 0.5, 
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontFamily: 'Sakkal Majalla'
            }}>
              {value}
            </Typography>
            <Typography variant="h6" sx={{ 
              opacity: 0.95, 
              fontWeight: 600, 
              mb: 0.5,
              fontFamily: 'Sakkal Majalla',
              fontSize: { xs: '1rem', sm: '1.125rem' }
            }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ 
                opacity: 0.8,
                fontFamily: 'Sakkal Majalla',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            width: { xs: 50, sm: 60 },
            height: { xs: 50, sm: 60 },
            backdropFilter: 'blur(10px)'
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }) => {
    const statusConfig = getStatusConfig(project.project_status);
    
    return (
      <Card sx={{
        height: '420px',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
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
          background: `linear-gradient(90deg, ${statusConfig.color}, ${statusConfig.border})`,
        }
      }}>
        <CardContent sx={{ 
          p: 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          fontFamily: 'Sakkal Majalla'
        }}>
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
                  fontFamily: 'Sakkal Majalla',
                  fontSize: '1.25rem',
                  minHeight: '2.6rem'
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
                  border: `2px solid ${statusConfig.border}`,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  height: 32,
                  fontFamily: 'Sakkal Majalla',
                  '& .MuiChip-icon': {
                    color: statusConfig.color
                  }
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
              <Tooltip title="أوامر التغيير">
                <IconButton
                  size="small"
                  onClick={(e) => handleActionMenuClick(e, project)}
                  sx={{
                    bgcolor: 'info.50',
                    color: 'info.main',
                    '&:hover': { bgcolor: 'info.100' }
                  }}
                >
                  <MoreVertIcon fontSize="small" />
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
          <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <BusinessIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: 'Sakkal Majalla',
                    fontSize: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {project.beneficiary_organization || 'غير محدد'}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1.5}>
                <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: 'Sakkal Majalla',
                    fontSize: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {project.university_project_manager || 'غير محدد'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5}>
                <MoneyIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla',
                    fontSize: '1rem',
                    color: 'primary.main'
                  }}
                >
                  {formatCurrency(project.project_cost)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5}>
                <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: 'Sakkal Majalla',
                    fontSize: '1rem'
                  }}
                >
                  {formatDate(project.project_start_date)}
                </Typography>
              </Box>
            </Stack>

            {/* Footer */}
            <Box mt={3} pt={2} borderTop="1px solid" borderColor="divider">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontFamily: 'Sakkal Majalla', fontSize: '0.875rem' }}
                >
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
                    fontFamily: 'Sakkal Majalla',
                    fontSize: '0.875rem'
                  }}
                >
                  عرض التفاصيل
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const ActionDialog = () => {
    const getDialogConfig = () => {
      switch (actionDialog.type) {
        case 'suspend':
          return {
            title: 'إيقاف المشروع',
            icon: <PauseIcon />,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          };
        case 'resume':
          return {
            title: 'استئناف المشروع',
            icon: <ResumeIcon />,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          };
        case 'extend':
          return {
            title: 'تمديد المشروع',
            icon: <ExtendIcon />,
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
          };
        case 'cancel':
          return {
            title: 'إلغاء المشروع',
            icon: <CancelIcon />,
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          };
        default:
          return { title: '', icon: null, color: '', gradient: '' };
      }
    };

    const config = getDialogConfig();

    return (
      <Dialog
        open={actionDialog.open}
        onClose={closeActionDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: config.gradient,
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {config.icon}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>
              {config.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: 'Sakkal Majalla' }}>
              {actionDialog.project?.project_name}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {actionDialog.type === 'suspend' && (
              <>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ الإيقاف"
                    value={actionData.suspension_date ? dayjs(actionData.suspension_date) : null}
                    onChange={(date) => setActionData(prev => ({ 
                      ...prev, 
                      suspension_date: date ? date.format('YYYY-MM-DD') : null 
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            height: '56px',
                            fontFamily: 'Sakkal Majalla'
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: 'Sakkal Majalla'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="مدة الإيقاف (أيام)"
                    type="number"
                    value={actionData.suspension_duration || ''}
                    onChange={(e) => setActionData(prev => ({ 
                      ...prev, 
                      suspension_duration: e.target.value 
                    }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: '56px',
                        fontFamily: 'Sakkal Majalla'
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات الإيقاف"
                    multiline
                    rows={3}
                    value={actionData.suspension_notes || ''}
                    onChange={(e) => setActionData(prev => ({ 
                      ...prev, 
                      suspension_notes: e.target.value 
                    }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Sakkal Majalla'
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Grid>
              </>
            )}

            {actionDialog.type === 'resume' && (
              <>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ الاستئناف"
                    value={actionData.resumption_date ? dayjs(actionData.resumption_date) : null}
                    onChange={(date) => setActionData(prev => ({ 
                      ...prev, 
                      resumption_date: date ? date.format('YYYY-MM-DD') : null 
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            height: '56px',
                            fontFamily: 'Sakkal Majalla'
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: 'Sakkal Majalla'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ نهاية المشروع بعد الاستئناف"
                    value={actionData.resumption_end_date ? dayjs(actionData.resumption_end_date) : null}
                    onChange={(date) => setActionData(prev => ({ 
                      ...prev, 
                      resumption_end_date: date ? date.format('YYYY-MM-DD') : null 
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            height: '56px',
                            fontFamily: 'Sakkal Majalla'
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: 'Sakkal Majalla'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات الاستئناف"
                    multiline
                    rows={3}
                    value={actionData.resumption_notes || ''}
                    onChange={(e) => setActionData(prev => ({ 
                      ...prev, 
                      resumption_notes: e.target.value 
                    }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Sakkal Majalla'
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Grid>
              </>
            )}

            {actionDialog.type === 'extend' && (
              <>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel 
                      component="legend" 
                      sx={{ 
                        fontFamily: 'Sakkal Majalla', 
                        fontWeight: 600, 
                        color: 'text.primary',
                        mb: 2
                      }}
                    >
                      ادخل المدة أولاً ثم اختر نوعها
                    </FormLabel>
                    <RadioGroup
                      row
                      value={actionData.extension_type || 'days'}
                      onChange={(e) => setActionData(prev => ({ 
                        ...prev, 
                        extension_type: e.target.value 
                      }))}
                    >
                      <FormControlLabel
                        value="days"
                        control={<Radio />}
                        label={<Typography sx={{ fontFamily: 'Sakkal Majalla' }}>يوم</Typography>}
                      />
                      <FormControlLabel
                        value="weeks"
                        control={<Radio />}
                        label={<Typography sx={{ fontFamily: 'Sakkal Majalla' }}>أسبوع</Typography>}
                      />
                      <FormControlLabel
                        value="months"
                        control={<Radio />}
                        label={<Typography sx={{ fontFamily: 'Sakkal Majalla' }}>شهر</Typography>}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="مدة التمديد"
                    type="number"
                    value={actionData.extension_duration || ''}
                    onChange={(e) => setActionData(prev => ({ 
                      ...prev, 
                      extension_duration: e.target.value 
                    }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        height: '56px',
                        fontFamily: 'Sakkal Majalla'
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="تاريخ نهاية المشروع بعد التمديد"
                    value={actionData.extension_end_date ? dayjs(actionData.extension_end_date) : null}
                    onChange={(date) => setActionData(prev => ({ 
                      ...prev, 
                      extension_end_date: date ? date.format('YYYY-MM-DD') : null 
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            height: '56px',
                            fontFamily: 'Sakkal Majalla'
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: 'Sakkal Majalla'
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات التمديد"
                    multiline
                    rows={3}
                    value={actionData.extension_notes || ''}
                    onChange={(e) => setActionData(prev => ({ 
                      ...prev, 
                      extension_notes: e.target.value 
                    }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Sakkal Majalla'
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Grid>
              </>
            )}

            {actionDialog.type === 'cancel' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ملاحظات الإلغاء"
                  multiline
                  rows={4}
                  value={actionData.cancellation_notes || ''}
                  onChange={(e) => setActionData(prev => ({ 
                    ...prev, 
                    cancellation_notes: e.target.value 
                  }))}
                  placeholder="اذكر أسباب إلغاء المشروع والتفاصيل ذات الصلة..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Sakkal Majalla'
                    },
                    '& .MuiInputLabel-root': {
                      fontFamily: 'Sakkal Majalla'
                    }
                  }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={closeActionDialog}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontFamily: 'Sakkal Majalla'
            }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleActionSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: config.gradient,
              fontFamily: 'Sakkal Majalla',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            حفظ التغييرات
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ py: 4 }}>
          <Skeleton variant="text" width={300} height={60} sx={{ mb: 4 }} />
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={item}>
                <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
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
                  fontFamily: 'Sakkal Majalla',
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}
              >
                نظرة شاملة على جميع المشاريع والإحصائيات مع أوامر التغيير
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
                fontSize: { xs: '0.875rem', sm: '1rem' },
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
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي المشاريع"
                value={totalProjects}
                icon={<AssignmentIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                subtitle="جميع المشاريع المسجلة"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="مشاريع مكتملة"
                value={completedProjects}
                icon={<CheckCircleIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                subtitle={`${totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}% من المشاريع`}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="قيد التنفيذ"
                value={inProgressProjects}
                icon={<ScheduleIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                subtitle="مشاريع نشطة حالياً"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="إجمالي الميزانية"
                value={`${(totalBudget / 1000000).toFixed(1)}م ر.س`}
                icon={<TrendingUpIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />}
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
                fontFamily: 'Sakkal Majalla',
                fontSize: '1rem',
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
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 1, 
                  color: 'text.secondary',
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                لا توجد مشاريع حالياً
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
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
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                إنشاء مشروع جديد
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleActionMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                minWidth: 200
              }
            }}
          >
            <MenuItem onClick={() => openActionDialog('suspend')} sx={{ py: 1.5, fontFamily: 'Sakkal Majalla' }}>
              <ListItemIcon>
                <PauseIcon sx={{ color: '#f59e0b' }} />
              </ListItemIcon>
              <ListItemText primary="إيقاف المشروع" />
            </MenuItem>
            <MenuItem onClick={() => openActionDialog('resume')} sx={{ py: 1.5, fontFamily: 'Sakkal Majalla' }}>
              <ListItemIcon>
                <ResumeIcon sx={{ color: '#10b981' }} />
              </ListItemIcon>
              <ListItemText primary="استئناف المشروع" />
            </MenuItem>
            <MenuItem onClick={() => openActionDialog('extend')} sx={{ py: 1.5, fontFamily: 'Sakkal Majalla' }}>
              <ListItemIcon>
                <ExtendIcon sx={{ color: '#06b6d4' }} />
              </ListItemIcon>
              <ListItemText primary="تمديد المشروع" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => openActionDialog('cancel')} sx={{ py: 1.5, fontFamily: 'Sakkal Majalla' }}>
              <ListItemIcon>
                <CancelIcon sx={{ color: '#ef4444' }} />
              </ListItemIcon>
              <ListItemText primary="إلغاء المشروع" />
            </MenuItem>
          </Menu>

          {/* Action Dialog */}
          <ActionDialog />

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, project: null })}
            PaperProps={{
              sx: {
                borderRadius: 4,
                minWidth: 400,
                overflow: 'hidden',
                fontFamily: 'Sakkal Majalla'
              }
            }}
          >
            <DialogTitle sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              pb: 2,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              textAlign: 'center',
              fontFamily: 'Sakkal Majalla'
            }}>
              تأكيد حذف المشروع
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3, textAlign: 'center' }}>
              <DeleteIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                هل أنت متأكد من حذف هذا المشروع؟
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontFamily: 'Sakkal Majalla' }}
              >
                "{deleteDialog.project?.project_name}"
              </Typography>
              <Typography 
                variant="body2" 
                color="error.main" 
                sx={{ 
                  mt: 2, 
                  fontWeight: 500,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
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
                  fontFamily: 'Sakkal Majalla',
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
                  fontFamily: 'Sakkal Majalla',
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
      </Box>
    </Fade>
  );
};

export default ProjectsList;