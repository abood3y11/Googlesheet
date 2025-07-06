import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Avatar,
  Stack,
  Fade,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Zoom
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  Extension as ExtendIcon,
  Cancel as CancelProjectIcon,
  ViewList as ListViewIcon,
  ViewModule as KanbanViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, project: null });
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', project: null });
  const [actionData, setActionData] = useState({
    suspensionDate: dayjs(),
    resumptionDate: dayjs(),
    extensionDays: '',
    extensionEndDate: dayjs(),
    cancellationDate: dayjs(),
    notes: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fake data for demonstration
      const fakeProjects = [
        {
          id: 1,
          project_name: "نظام إدارة المشاريع الذكي",
          beneficiary_organization: "جامعة الملك سعود",
          university_project_manager: "د. أحمد محمد السعيد",
          technical_responsible_beneficiary: "م. سارة أحمد الزهراني",
          university_project_team: "فريق تطوير الأنظمة",
          executing_company_name: "شركة التقنية المتقدمة",
          executing_company_project_manager: "م. محمد علي الأحمد",
          executing_company_representative: "أ. فاطمة سالم",
          authorization_number: "AUTH-2024-001",
          project_authorization_date: "2024-01-15",
          project_cost: 750000.00,
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
          notes: "مشروع تطوير نظام إدارة المشاريع الذكي للجامعة"
        },
        {
          id: 2,
          project_name: "منصة التعلم الإلكتروني",
          beneficiary_organization: "جامعة الملك فهد",
          university_project_manager: "د. خالد عبدالله",
          technical_responsible_beneficiary: "م. نورا محمد",
          university_project_team: "فريق التعلم الرقمي",
          executing_company_name: "شركة الحلول التقنية",
          executing_company_project_manager: "م. عبدالرحمن أحمد",
          executing_company_representative: "أ. مريم علي",
          authorization_number: "AUTH-2024-002",
          project_authorization_date: "2024-02-01",
          project_cost: 950000.00,
          purchase_order_number: "PO-2024-002",
          charter_preparation_date: "2024-01-25",
          project_start_date: "2024-03-01",
          type_of_project_start: "scheduled",
          project_duration_days: 240,
          planned_project_end_date: "2024-10-28",
          actual_project_end_date: null,
          site_handover_date: "2024-02-20",
          contract_signing_date: "2024-02-15",
          project_status: "planning",
          project_suspension_date: null,
          suspension_duration: null,
          project_resumption_date: null,
          notes: "منصة تعلم إلكتروني متطورة مع ذكاء اصطناعي"
        },
        {
          id: 3,
          project_name: "نظام إدارة المكتبات الرقمية",
          beneficiary_organization: "جامعة الأميرة نورا",
          university_project_manager: "د. هند الفيصل",
          technical_responsible_beneficiary: "م. ريم عبدالله",
          university_project_team: "فريق المكتبات الرقمية",
          executing_company_name: "شركة المعرفة التقنية",
          executing_company_project_manager: "م. يوسف محمد",
          executing_company_representative: "أ. أمل سعد",
          authorization_number: "AUTH-2024-003",
          project_authorization_date: "2024-01-20",
          project_cost: 650000.00,
          purchase_order_number: "PO-2024-003",
          charter_preparation_date: "2024-01-15",
          project_start_date: "2024-02-15",
          type_of_project_start: "immediate",
          project_duration_days: 150,
          planned_project_end_date: "2024-07-15",
          actual_project_end_date: null,
          site_handover_date: "2024-02-10",
          contract_signing_date: "2024-02-05",
          project_status: "suspended",
          project_suspension_date: "2024-04-01",
          suspension_duration: 30,
          project_resumption_date: null,
          notes: "نظام إدارة مكتبات رقمية شامل مع محرك بحث متقدم"
        },
        {
          id: 4,
          project_name: "تطبيق الخدمات الطلابية",
          beneficiary_organization: "جامعة الإمام محمد بن سعود",
          university_project_manager: "د. عبدالعزيز الراشد",
          technical_responsible_beneficiary: "م. لينا أحمد",
          university_project_team: "فريق الخدمات الطلابية",
          executing_company_name: "شركة الابتكار التقني",
          executing_company_project_manager: "م. فهد العتيبي",
          executing_company_representative: "أ. نوف الحربي",
          authorization_number: "AUTH-2024-004",
          project_authorization_date: "2024-03-01",
          project_cost: 480000.00,
          purchase_order_number: "PO-2024-004",
          charter_preparation_date: "2024-02-25",
          project_start_date: "2024-04-01",
          type_of_project_start: "scheduled",
          project_duration_days: 120,
          planned_project_end_date: "2024-07-30",
          actual_project_end_date: "2024-07-25",
          site_handover_date: "2024-03-25",
          contract_signing_date: "2024-03-20",
          project_status: "completed",
          project_suspension_date: null,
          suspension_duration: null,
          project_resumption_date: null,
          notes: "تطبيق موبايل للخدمات الطلابية مع واجهة سهلة الاستخدام"
        },
        {
          id: 5,
          project_name: "نظام إدارة الموارد البشرية",
          beneficiary_organization: "جامعة الملك خالد",
          university_project_manager: "د. سعد العمري",
          technical_responsible_beneficiary: "م. هيفاء محمد",
          university_project_team: "فريق الموارد البشرية",
          executing_company_name: "شركة الأنظمة المتكاملة",
          executing_company_project_manager: "م. طارق الشهري",
          executing_company_representative: "أ. رنا القحطاني",
          authorization_number: "AUTH-2024-005",
          project_authorization_date: "2024-02-10",
          project_cost: 820000.00,
          purchase_order_number: "PO-2024-005",
          charter_preparation_date: "2024-02-05",
          project_start_date: "2024-03-15",
          type_of_project_start: "conditional",
          project_duration_days: 200,
          planned_project_end_date: "2024-10-01",
          actual_project_end_date: null,
          site_handover_date: "2024-03-10",
          contract_signing_date: "2024-03-05",
          project_status: "cancelled",
          project_suspension_date: null,
          suspension_duration: null,
          project_resumption_date: null,
          notes: "نظام شامل لإدارة الموارد البشرية مع تقارير متقدمة - تم إلغاؤه لأسباب إدارية"
        }
      ];
      
      setProjects(fakeProjects);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const filteredProjects = projects.filter(project => {
    if (filterStatus === 'all') return true;
    return project.project_status === filterStatus;
  });

  const handleActionMenuOpen = (event, project) => {
    setActionMenu({ anchorEl: event.currentTarget, project });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchorEl: null, project: null });
  };

  const handleActionClick = (actionType) => {
    setActionDialog({
      open: true,
      type: actionType,
      project: actionMenu.project
    });
    handleActionMenuClose();
  };

  const handleActionSubmit = async () => {
    try {
      const { type, project } = actionDialog;
      let updatedProject = { ...project };
      
      switch (type) {
        case 'suspend':
          updatedProject.project_status = 'suspended';
          updatedProject.project_suspension_date = actionData.suspensionDate.format('YYYY-MM-DD');
          break;
          
        case 'resume':
          const suspensionStart = dayjs(project.project_suspension_date);
          const resumptionDate = actionData.resumptionDate;
          const suspensionDays = resumptionDate.diff(suspensionStart, 'day');
          
          updatedProject.project_status = 'in_progress';
          updatedProject.project_resumption_date = resumptionDate.format('YYYY-MM-DD');
          updatedProject.suspension_duration = suspensionDays;
          
          // Auto-calculate new end date
          const originalEndDate = dayjs(project.planned_project_end_date);
          const newEndDate = originalEndDate.add(suspensionDays, 'day');
          updatedProject.planned_project_end_date = newEndDate.format('YYYY-MM-DD');
          break;
          
        case 'extend':
          const extensionDays = parseInt(actionData.extensionDays);
          const currentEndDate = dayjs(project.planned_project_end_date);
          const extendedEndDate = currentEndDate.add(extensionDays, 'day');
          
          updatedProject.project_duration_days = project.project_duration_days + extensionDays;
          updatedProject.planned_project_end_date = extendedEndDate.format('YYYY-MM-DD');
          break;
          
        case 'cancel':
          updatedProject.project_status = 'cancelled';
          updatedProject.actual_project_end_date = actionData.cancellationDate.format('YYYY-MM-DD');
          break;
      }
      
      // Update notes if provided
      if (actionData.notes.trim()) {
        updatedProject.notes = actionData.notes;
      }
      
      // Update the project in the list
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      
      // Close dialog and reset data
      setActionDialog({ open: false, type: '', project: null });
      setActionData({
        suspensionDate: dayjs(),
        resumptionDate: dayjs(),
        extensionDays: '',
        extensionEndDate: dayjs(),
        cancellationDate: dayjs(),
        notes: ''
      });
      
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const getActionDialogTitle = (type) => {
    const titles = {
      suspend: 'إيقاف المشروع',
      resume: 'استئناف المشروع',
      extend: 'تمديد المشروع',
      cancel: 'إلغاء المشروع'
    };
    return titles[type] || '';
  };

  const ProjectCard = ({ project }) => {
    const statusConfig = getStatusConfig(project.project_status);
    
    return (
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
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
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" position="relative" zIndex={1}>
            <Box flex={1}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  fontFamily: 'Sakkal Majalla',
                  lineHeight: 1.3
                }}
              >
                {project.project_name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.9,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {project.beneficiary_organization}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => handleActionMenuOpen(e, project)}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                sx={{
                  bgcolor: statusConfig.bg,
                  color: statusConfig.color,
                  border: `2px solid ${statusConfig.border}`,
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla',
                  '& .MuiChip-icon': {
                    color: statusConfig.color
                  }
                }}
              />
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
            
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
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
                {project.university_project_manager}
              </Typography>
            </Box>
            
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                الشركة المنفذة
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  fontFamily: 'Sakkal Majalla'
                }}
              >
                {project.executing_company_name}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
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
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: 'Sakkal Majalla'
                  }}
                >
                  {formatDate(project.project_start_date)}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla'
                  }}
                >
                  تاريخ الانتهاء
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: 'Sakkal Majalla'
                  }}
                >
                  {formatDate(project.planned_project_end_date)}
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" gap={1} pt={1}>
              <Tooltip title="عرض التفاصيل">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.100',
                    }
                  }}
                >
                  <ViewIcon />
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
                      bgcolor: 'warning.100',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const KanbanColumn = ({ status, title, projects }) => {
    const statusConfig = getStatusConfig(status);
    
    return (
      <Box sx={{ minWidth: 300, maxWidth: 350 }}>
        <Box sx={{
          bgcolor: statusConfig.bg,
          border: `2px solid ${statusConfig.border}`,
          borderRadius: 3,
          p: 2,
          mb: 2
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            {statusConfig.icon}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: statusConfig.color,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              {title}
            </Typography>
            <Chip 
              label={projects.length} 
              size="small" 
              sx={{ 
                bgcolor: statusConfig.color,
                color: 'white',
                fontWeight: 600,
                minWidth: 24,
                height: 24
              }} 
            />
          </Box>
        </Box>
        
        <Stack spacing={2}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Stack>
      </Box>
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
            onClick={fetchProjects}
            variant="contained"
            sx={{ 
              borderRadius: 3,
              fontFamily: 'Sakkal Majalla'
            }}
          >
            إعادة المحاولة
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
                عرض وإدارة جميع المشاريع في النظام
              </Typography>
            </Box>

            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              {/* View Mode Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: '12px !important',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    fontFamily: 'Sakkal Majalla',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="list">
                  <ListViewIcon sx={{ mr: 1 }} />
                  قائمة
                </ToggleButton>
                <ToggleButton value="kanban">
                  <KanbanViewIcon sx={{ mr: 1 }} />
                  كانبان
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Filter */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel sx={{ fontFamily: 'Sakkal Majalla' }}>تصفية حسب الحالة</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="تصفية حسب الحالة"
                  sx={{
                    borderRadius: 3,
                    fontFamily: 'Sakkal Majalla',
                    '& .MuiSelect-select': {
                      fontFamily: 'Sakkal Majalla'
                    }
                  }}
                >
                  <MenuItem value="all">
                    <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>جميع المشاريع</Typography>
                  </MenuItem>
                  <MenuItem value="planning">
                    <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>تخطيط</Typography>
                  </MenuItem>
                  <MenuItem value="in_progress">
                    <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>قيد التنفيذ</Typography>
                  </MenuItem>
                  <MenuItem value="suspended">
                    <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>متوقف</Typography>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>مكتمل</Typography>
                  </MenuItem>
                  <MenuItem value="cancelled">
                    <Typography sx={{ fontFamily: 'Sakkal Majalla' }}>ملغي</Typography>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Content */}
          {viewMode === 'list' ? (
            <Grid container spacing={3}>
              {filteredProjects.map((project) => (
                <Grid item xs={12} sm={6} lg={4} key={project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              overflowX: 'auto', 
              pb: 2,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'primary.main',
                borderRadius: 4,
              }
            }}>
              <KanbanColumn 
                status="planning" 
                title="تخطيط" 
                projects={filteredProjects.filter(p => p.project_status === 'planning')} 
              />
              <KanbanColumn 
                status="in_progress" 
                title="قيد التنفيذ" 
                projects={filteredProjects.filter(p => p.project_status === 'in_progress')} 
              />
              <KanbanColumn 
                status="suspended" 
                title="متوقف" 
                projects={filteredProjects.filter(p => p.project_status === 'suspended')} 
              />
              <KanbanColumn 
                status="completed" 
                title="مكتمل" 
                projects={filteredProjects.filter(p => p.project_status === 'completed')} 
              />
              <KanbanColumn 
                status="cancelled" 
                title="ملغي" 
                projects={filteredProjects.filter(p => p.project_status === 'cancelled')} 
              />
            </Box>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <Box textAlign="center" py={8}>
              <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ 
                  mb: 1,
                  fontFamily: 'Sakkal Majalla'
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
                {filterStatus === 'all' ? 'لم يتم إنشاء أي مشاريع بعد' : 'لا توجد مشاريع بهذه الحالة'}
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
            </Box>
          )}

          {/* Floating Action Button */}
          <Zoom in={true} timeout={500}>
            <Fab
              color="primary"
              onClick={() => navigate('/projects/new')}
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <AddIcon />
            </Fab>
          </Zoom>

          {/* Action Menu */}
          <Menu
            anchorEl={actionMenu.anchorEl}
            open={Boolean(actionMenu.anchorEl)}
            onClose={handleActionMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                mt: 1
              }
            }}
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

          {/* Action Dialog */}
          <Dialog
            open={actionDialog.open}
            onClose={() => setActionDialog({ open: false, type: '', project: null })}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                overflow: 'hidden'
              }
            }}
          >
            <DialogTitle sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              pb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center',
              fontFamily: 'Sakkal Majalla'
            }}>
              {getActionDialogTitle(actionDialog.type)}
            </DialogTitle>
            
            <DialogContent sx={{ pt: 4, pb: 3 }}>
              <Stack spacing={3}>
                {actionDialog.type === 'suspend' && (
                  <DatePicker
                    label="تاريخ الإيقاف"
                    value={actionData.suspensionDate}
                    onChange={(date) => setActionData(prev => ({ ...prev, suspensionDate: date }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Sakkal Majalla' },
                          '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                      />
                    )}
                  />
                )}

                {actionDialog.type === 'resume' && (
                  <DatePicker
                    label="تاريخ الاستئناف"
                    value={actionData.resumptionDate}
                    onChange={(date) => setActionData(prev => ({ ...prev, resumptionDate: date }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Sakkal Majalla' },
                          '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                      />
                    )}
                  />
                )}

                {actionDialog.type === 'extend' && (
                  <TextField
                    fullWidth
                    label="عدد أيام التمديد"
                    type="number"
                    value={actionData.extensionDays}
                    onChange={(e) => setActionData(prev => ({ ...prev, extensionDays: e.target.value }))}
                    sx={{
                      '& .MuiInputLabel-root': { fontFamily: 'Sakkal Majalla' },
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                )}

                {actionDialog.type === 'cancel' && (
                  <DatePicker
                    label="تاريخ الإلغاء"
                    value={actionData.cancellationDate}
                    onChange={(date) => setActionData(prev => ({ ...prev, cancellationDate: date }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{
                          '& .MuiInputLabel-root': { fontFamily: 'Sakkal Majalla' },
                          '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                      />
                    )}
                  />
                )}

                <TextField
                  fullWidth
                  label="ملاحظات (اختياري)"
                  multiline
                  rows={3}
                  value={actionData.notes}
                  onChange={(e) => setActionData(prev => ({ ...prev, notes: e.target.value }))}
                  sx={{
                    '& .MuiInputLabel-root': { fontFamily: 'Sakkal Majalla' },
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                />
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={() => setActionDialog({ open: false, type: '', project: null })}
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
                onClick={handleActionSubmit}
                variant="contained"
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
                تأكيد
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectsList;