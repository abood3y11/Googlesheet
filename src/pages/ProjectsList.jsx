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
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio
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
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  ViewModule as CardViewIcon,
  ViewKanban as KanbanViewIcon,
  List as ListViewIcon,
  MoreVert as MoreVertIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  Extension as ExtendIcon,
  Stop as CancelProjectIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null });
  const [viewMode, setViewMode] = useState('cards');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Project Actions Menu
  const [actionMenu, setActionMenu] = useState({ anchorEl: null, project: null });
  const [actionDialog, setActionDialog] = useState({ open: false, type: null, project: null });
  const [actionFormData, setActionFormData] = useState({});

  const navigate = useNavigate();

  // Fake data for demonstration
  const fakeProjects = [
    {
      id: 1,
      project_name: "نظام إدارة المكتبات الرقمية",
      beneficiary_organization: "جامعة الملك سعود",
      university_project_manager: "د. أحمد محمد العلي",
      technical_responsible_beneficiary: "م. سارة أحمد الزهراني",
      university_project_team: "فريق تطوير الأنظمة الذكية",
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
      notes: "مشروع تطوير نظام إدارة المكتبات الرقمية للجامعة"
    },
    {
      id: 2,
      project_name: "منصة التعلم الإلكتروني المتطورة",
      beneficiary_organization: "جامعة الملك عبدالعزيز",
      university_project_manager: "د. نورا خالد الغامدي",
      technical_responsible_beneficiary: "م. عبدالله سعد المطيري",
      university_project_team: "فريق التعلم الإلكتروني",
      executing_company_name: "مجموعة الحلول التقنية",
      executing_company_project_manager: "م. ريم عبدالرحمن",
      executing_company_representative: "أ. خالد محمد الشهري",
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
      site_handover_date: "2024-02-20",
      contract_signing_date: "2024-02-10",
      project_status: "planning",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "تطوير منصة تعلم إلكتروني شاملة مع أدوات تفاعلية متقدمة"
    },
    {
      id: 3,
      project_name: "نظام إدارة الموارد البشرية",
      beneficiary_organization: "جامعة الإمام محمد بن سعود",
      university_project_manager: "د. عبدالعزيز فهد الراشد",
      technical_responsible_beneficiary: "م. هند علي الدوسري",
      university_project_team: "فريق الموارد البشرية التقني",
      executing_company_name: "شركة الأنظمة المتكاملة",
      executing_company_project_manager: "م. طارق أحمد البلوي",
      executing_company_representative: "أ. منى سعد العتيبي",
      authorization_number: "AUTH-2024-003",
      project_authorization_date: "2024-01-20",
      project_cost: 650000,
      purchase_order_number: "PO-2024-003",
      charter_preparation_date: "2024-01-15",
      project_start_date: "2024-02-15",
      type_of_project_start: "immediate",
      project_duration_days: 150,
      planned_project_end_date: "2024-07-15",
      actual_project_end_date: "2024-07-20",
      site_handover_date: "2024-02-10",
      contract_signing_date: "2024-02-05",
      project_status: "completed",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "نظام شامل لإدارة الموارد البشرية مع تقارير متقدمة"
    },
    {
      id: 4,
      project_name: "تطبيق الخدمات الطلابية الذكي",
      beneficiary_organization: "جامعة الملك فهد للبترول والمعادن",
      university_project_manager: "د. سلطان محمد الحربي",
      technical_responsible_beneficiary: "م. لينا عبدالله الشمري",
      university_project_team: "فريق الخدمات الطلابية",
      executing_company_name: "تقنيات المستقبل",
      executing_company_project_manager: "م. عمر يوسف الزهراني",
      executing_company_representative: "أ. رانيا أحمد القرني",
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
      project_resumption_date: "2024-06-01",
      notes: "تطبيق جوال للخدمات الطلابية مع واجهة سهلة الاستخدام"
    },
    {
      id: 5,
      project_name: "نظام إدارة البحوث والدراسات العليا",
      beneficiary_organization: "جامعة الملك خالد",
      university_project_manager: "د. فايز عبدالرحمن العسيري",
      technical_responsible_beneficiary: "م. نوف محمد الشهراني",
      university_project_team: "فريق البحوث والتطوير",
      executing_company_name: "الحلول الذكية المحدودة",
      executing_company_project_manager: "م. بدر سعد الغامدي",
      executing_company_representative: "أ. أمل خالد القحطاني",
      authorization_number: "AUTH-2024-005",
      project_authorization_date: "2024-02-10",
      project_cost: 750000,
      purchase_order_number: "PO-2024-005",
      charter_preparation_date: "2024-02-05",
      project_start_date: "2024-02-25",
      type_of_project_start: "scheduled",
      project_duration_days: 200,
      planned_project_end_date: "2024-09-15",
      actual_project_end_date: null,
      site_handover_date: "2024-02-20",
      contract_signing_date: "2024-02-15",
      project_status: "cancelled",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "نظام متكامل لإدارة البحوث والدراسات العليا - تم إلغاؤه لأسباب إدارية"
    },
    {
      id: 6,
      project_name: "منصة الامتحانات الإلكترونية الآمنة",
      beneficiary_organization: "جامعة طيبة",
      university_project_manager: "د. وليد عبدالله الحارثي",
      technical_responsible_beneficiary: "م. غادة سالم الجهني",
      university_project_team: "فريق التقييم الإلكتروني",
      executing_company_name: "شركة الأمان التقني",
      executing_company_project_manager: "م. ماجد فهد العنزي",
      executing_company_representative: "أ. سعاد محمد الطويرقي",
      authorization_number: "AUTH-2024-006",
      project_authorization_date: "2024-03-15",
      project_cost: 950000,
      purchase_order_number: "PO-2024-006",
      charter_preparation_date: "2024-03-10",
      project_start_date: "2024-04-01",
      type_of_project_start: "immediate",
      project_duration_days: 160,
      planned_project_end_date: "2024-09-10",
      actual_project_end_date: null,
      site_handover_date: "2024-03-25",
      contract_signing_date: "2024-03-20",
      project_status: "in_progress",
      project_suspension_date: null,
      suspension_duration: null,
      project_resumption_date: null,
      notes: "منصة آمنة للامتحانات الإلكترونية مع تقنيات مكافحة الغش"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(fakeProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const handleActionMenuOpen = (event, project) => {
    event.stopPropagation();
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
    setActionFormData({});
    handleActionMenuClose();
  };

  const handleActionSubmit = async () => {
    try {
      const { type, project } = actionDialog;
      
      // Calculate automatic fields based on action type
      let updatedProject = { ...project };
      const today = dayjs();
      
      switch (type) {
        case 'suspend':
          updatedProject.project_status = 'suspended';
          updatedProject.project_suspension_date = actionFormData.suspensionDate || today.format('YYYY-MM-DD');
          break;
          
        case 'resume':
          const suspensionDate = dayjs(project.project_suspension_date);
          const resumeDate = actionFormData.resumptionDate ? dayjs(actionFormData.resumptionDate) : today;
          
          // Calculate suspension duration automatically
          const suspensionDuration = resumeDate.diff(suspensionDate, 'day');
          
          // Calculate new end date by adding suspension duration
          const originalEndDate = dayjs(project.planned_project_end_date);
          const newEndDate = originalEndDate.add(suspensionDuration, 'day');
          
          updatedProject.project_status = 'in_progress';
          updatedProject.project_resumption_date = resumeDate.format('YYYY-MM-DD');
          updatedProject.suspension_duration = suspensionDuration;
          updatedProject.planned_project_end_date = newEndDate.format('YYYY-MM-DD');
          break;
          
        case 'extend':
          const extensionDays = parseInt(actionFormData.extensionDays) || 0;
          const currentEndDate = dayjs(project.planned_project_end_date);
          const extendedEndDate = currentEndDate.add(extensionDays, 'day');
          
          // Update duration and end date
          updatedProject.project_duration_days = (project.project_duration_days || 0) + extensionDays;
          updatedProject.planned_project_end_date = extendedEndDate.format('YYYY-MM-DD');
          break;
          
        case 'cancel':
          updatedProject.project_status = 'cancelled';
          updatedProject.actual_project_end_date = today.format('YYYY-MM-DD');
          break;
      }
      
      // Add notes if provided
      if (actionFormData.notes) {
        updatedProject.notes = (updatedProject.notes || '') + '\n' + 
          `[${today.format('YYYY-MM-DD')}] ${actionFormData.notes}`;
      }
      
      // Update projects list
      setProjects(prev => prev.map(p => 
        p.id === project.id ? updatedProject : p
      ));
      
      setActionDialog({ open: false, type: null, project: null });
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      setProjects(projects.filter(p => p.id !== projectId));
      setDeleteDialog({ open: false, project: null });
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
        height: '380px',
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
                  onClick={(e) => handleActionMenuOpen(e, project)}
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

  const KanbanColumn = ({ status, title, projects, color }) => (
    <Paper sx={{
      minWidth: 300,
      maxWidth: 300,
      height: 'fit-content',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.04)'
    }}>
      <Box sx={{
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        color: 'white',
        p: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700,
          fontFamily: 'Sakkal Majalla'
        }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ 
          opacity: 0.9,
          fontFamily: 'Sakkal Majalla'
        }}>
          {projects.length} مشروع
        </Typography>
      </Box>
      <Box sx={{ p: 2, maxHeight: '70vh', overflowY: 'auto' }}>
        <Stack spacing={2}>
          {projects.map((project) => (
            <Card key={project.id} sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: 'Sakkal Majalla',
                  fontSize: '1rem',
                  lineHeight: 1.3
                }}>
                  {project.project_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  mb: 1,
                  fontFamily: 'Sakkal Majalla',
                  fontSize: '0.875rem'
                }}>
                  {project.beneficiary_organization}
                </Typography>
                <Typography variant="body2" sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                  fontFamily: 'Sakkal Majalla'
                }}>
                  {formatCurrency(project.project_cost)}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary" sx={{
                    fontFamily: 'Sakkal Majalla'
                  }}>
                    {formatDate(project.project_start_date)}
                  </Typography>
                  <Box display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/projects/${project.id}`)}
                      sx={{ color: 'primary.main' }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, project)}
                      sx={{ color: 'info.main' }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Paper>
  );

  const ListView = () => {
    const displayedProjects = projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>اسم المشروع</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>الجهة المستفيدة</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>مدير المشروع</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>التكلفة</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>تاريخ البداية</TableCell>
                <TableCell sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProjects.map((project) => {
                const statusConfig = getStatusConfig(project.project_status);
                return (
                  <TableRow key={project.id} sx={{
                    '&:hover': { bgcolor: 'grey.50' },
                    cursor: 'pointer'
                  }}>
                    <TableCell 
                      onClick={() => navigate(`/projects/${project.id}`)}
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: 'Sakkal Majalla',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {project.project_name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Sakkal Majalla' }}>
                      {project.beneficiary_organization}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Sakkal Majalla' }}>
                      {project.university_project_manager}
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      fontFamily: 'Sakkal Majalla'
                    }}>
                      {formatCurrency(project.project_cost)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
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
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Sakkal Majalla' }}>
                      {formatDate(project.project_start_date)}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/projects/${project.id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/projects/${project.id}/edit`)}
                          sx={{ color: 'warning.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, project)}
                          sx={{ color: 'info.main' }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteDialog({ open: true, project })}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={projects.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="عدد الصفوف في الصفحة:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
          }
          sx={{
            '& .MuiTablePagination-toolbar': {
              fontFamily: 'Sakkal Majalla'
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: 'Sakkal Majalla'
            }
          }}
        />
      </Paper>
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
                <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  const kanbanColumns = [
    { status: 'planning', title: 'تخطيط', color: '#3b82f6' },
    { status: 'in_progress', title: 'قيد التنفيذ', color: '#10b981' },
    { status: 'suspended', title: 'متوقف', color: '#f59e0b' },
    { status: 'completed', title: 'مكتمل', color: '#8b5cf6' },
    { status: 'cancelled', title: 'ملغي', color: '#ef4444' },
  ];

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

          {/* View Toggle */}
          <Box display="flex" justifyContent="center" mb={4}>
            <TextField
    placeholder="ابحث عن مشروع..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    sx={{
      width: { xs: '100%', sm: '300px' },
      '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        height: '48px',
        fontFamily: 'Sakkal Majalla',
        fontSize: '1rem',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 2,
          borderColor: 'primary.main',
        },
      },
      '& .MuiInputLabel-root': {
        fontFamily: 'Sakkal Majalla',
        fontSize: '1rem',
        '&.Mui-focused': {
          color: 'primary.main',
        },
      },
    }}
  />
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
                fontSize: '1rem',
                '& .MuiAlert-icon': {
                  fontSize: 24
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Content based on view mode */}
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
            <>
              {/* Cards View */}
              {viewMode === 'cards' && (
                <Grid container spacing={3}>
                  {projects.map((project) => (
                    <Grid item xs={12} sm={6} lg={4} xl={3} key={project.id}>
                      <ProjectCard project={project} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Kanban View */}
              {viewMode === 'kanban' && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  overflowX: 'auto', 
                  pb: 2,
                  minHeight: '60vh'
                }}>
                  {kanbanColumns.map((column) => (
                    <KanbanColumn
                      key={column.status}
                      status={column.status}
                      title={column.title}
                      color={column.color}
                      projects={projects.filter(p => p.project_status === column.status)}
                    />
                  ))}
                </Box>
              )}

              {/* List View */}
              {viewMode === 'list' && <ListView />}
            </>
          )}

          {/* Action Menu */}
          <Menu
            anchorEl={actionMenu.anchorEl}
            open={Boolean(actionMenu.anchorEl)}
            onClose={handleActionMenuClose}
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

          {/* Action Dialog */}
          <Dialog
            open={actionDialog.open}
            onClose={() => setActionDialog({ open: false, type: null, project: null })}
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
              {actionDialog.type === 'suspend' && 'إيقاف المشروع'}
              {actionDialog.type === 'resume' && 'استئناف المشروع'}
              {actionDialog.type === 'extend' && 'تمديد المشروع'}
              {actionDialog.type === 'cancel' && 'إلغاء المشروع'}
            </DialogTitle>
            <DialogContent sx={{ pt: 4, pb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla',
                  textAlign: 'center'
                }}
              >
                {actionDialog.project?.project_name}
              </Typography>

              <Grid container spacing={3}>
                {actionDialog.type === 'suspend' && (
                  <>
                    <Grid item xs={12}>
                      <DatePicker
                        label="تاريخ الإيقاف"
                        value={actionFormData.suspensionDate ? dayjs(actionFormData.suspensionDate) : dayjs()}
                        onChange={(date) => setActionFormData(prev => ({
                          ...prev,
                          suspensionDate: date?.format('YYYY-MM-DD')
                        }))}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
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
                  </>
                )}

                {actionDialog.type === 'resume' && (
                  <>
                    <Grid item xs={12}>
                      <DatePicker
                        label="تاريخ الاستئناف"
                        value={actionFormData.resumptionDate ? dayjs(actionFormData.resumptionDate) : dayjs()}
                        onChange={(date) => setActionFormData(prev => ({
                          ...prev,
                          resumptionDate: date?.format('YYYY-MM-DD')
                        }))}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
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
                      <Alert severity="info" sx={{ fontFamily: 'Sakkal Majalla' }}>
                        سيتم حساب مدة الإيقاف وتاريخ النهاية الجديد تلقائياً
                      </Alert>
                    </Grid>
                  </>
                )}

                {actionDialog.type === 'extend' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="عدد أيام التمديد"
                        type="number"
                        value={actionFormData.extensionDays || ''}
                        onChange={(e) => setActionFormData(prev => ({
                          ...prev,
                          extensionDays: e.target.value
                        }))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontFamily: 'Sakkal Majalla'
                          },
                          '& .MuiInputLabel-root': {
                            fontFamily: 'Sakkal Majalla'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ fontFamily: 'Sakkal Majalla' }}>
                        سيتم تحديث تاريخ النهاية المخطط ومدة المشروع تلقائياً
                      </Alert>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ملاحظات"
                    multiline
                    rows={3}
                    value={actionFormData.notes || ''}
                    onChange={(e) => setActionFormData(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Sakkal Majalla'
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={() => setActionDialog({ open: false, type: null, project: null })}
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