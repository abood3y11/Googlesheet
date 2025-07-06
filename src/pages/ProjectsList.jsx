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
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  Extension as ExtendIcon,
  Cancel as CancelProjectIcon,
  ViewList as ListViewIcon,
  ViewModule as KanbanViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Mock data for demonstration
const mockProjects = [
  {
    id: 1,
    project_name: "مشروع تطوير النظام الإلكتروني",
    beneficiary_organization: "جامعة الملك سعود",
    university_project_manager: "د. أحمد محمد السعيد",
    technical_responsible_beneficiary: "م. سارة أحمد الخالد",
    university_project_team: "فريق التطوير التقني",
    executing_company_name: "شركة التقنية المتقدمة",
    executing_company_project_manager: "م. محمد علي الأحمد",
    executing_company_representative: "أ. فاطمة سالم النور",
    authorization_number: "AUTH-2024-001",
    project_authorization_date: "2024-01-15",
    project_cost: 500000.00,
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
    project_name: "مشروع تطوير البنية التحتية",
    beneficiary_organization: "جامعة الملك فهد",
    university_project_manager: "د. خالد عبدالله",
    technical_responsible_beneficiary: "م. نورا محمد",
    university_project_team: "فريق الهندسة",
    executing_company_name: "شركة البناء الحديث",
    executing_company_project_manager: "م. عبدالرحمن سالم",
    executing_company_representative: "أ. مريم أحمد",
    authorization_number: "AUTH-2024-002",
    project_authorization_date: "2024-02-01",
    project_cost: 750000.00,
    purchase_order_number: "PO-2024-002",
    charter_preparation_date: "2024-01-25",
    project_start_date: "2024-03-01",
    type_of_project_start: "scheduled",
    project_duration_days: 240,
    planned_project_end_date: "2024-10-30",
    actual_project_end_date: null,
    site_handover_date: "2024-02-15",
    contract_signing_date: "2024-02-10",
    project_status: "planning",
    project_suspension_date: null,
    suspension_duration: null,
    project_resumption_date: null,
    notes: "مشروع تطوير البنية التحتية للشبكات"
  },
  {
    id: 3,
    project_name: "مشروع نظام إدارة المكتبات",
    beneficiary_organization: "جامعة الإمام محمد بن سعود",
    university_project_manager: "د. عبدالعزيز الراشد",
    technical_responsible_beneficiary: "م. هند الفيصل",
    university_project_team: "فريق تقنية المعلومات",
    executing_company_name: "شركة الحلول الذكية",
    executing_company_project_manager: "م. سعد العتيبي",
    executing_company_representative: "أ. ريم الشهري",
    authorization_number: "AUTH-2024-003",
    project_authorization_date: "2024-01-20",
    project_cost: 300000.00,
    purchase_order_number: "PO-2024-003",
    charter_preparation_date: "2024-01-15",
    project_start_date: "2024-02-15",
    type_of_project_start: "immediate",
    project_duration_days: 120,
    planned_project_end_date: "2024-06-15",
    actual_project_end_date: "2024-06-10",
    site_handover_date: "2024-02-01",
    contract_signing_date: "2024-01-30",
    project_status: "completed",
    project_suspension_date: null,
    suspension_duration: null,
    project_resumption_date: null,
    notes: "مشروع تطوير نظام إدارة المكتبات الرقمية"
  },
  {
    id: 4,
    project_name: "مشروع تطوير منصة التعلم الإلكتروني",
    beneficiary_organization: "جامعة الملك عبدالعزيز",
    university_project_manager: "د. منى الغامدي",
    technical_responsible_beneficiary: "م. أحمد الزهراني",
    university_project_team: "فريق التعليم الإلكتروني",
    executing_company_name: "شركة التعليم التقني",
    executing_company_project_manager: "م. فهد القحطاني",
    executing_company_representative: "أ. نوف العسيري",
    authorization_number: "AUTH-2024-004",
    project_authorization_date: "2024-03-01",
    project_cost: 600000.00,
    purchase_order_number: "PO-2024-004",
    charter_preparation_date: "2024-02-20",
    project_start_date: "2024-04-01",
    type_of_project_start: "scheduled",
    project_duration_days: 200,
    planned_project_end_date: "2024-10-20",
    actual_project_end_date: null,
    site_handover_date: "2024-03-15",
    contract_signing_date: "2024-03-10",
    project_status: "suspended",
    project_suspension_date: "2024-06-15",
    suspension_duration: 30,
    project_resumption_date: null,
    notes: "مشروع تطوير منصة التعلم الإلكتروني المتقدمة"
  },
  {
    id: 5,
    project_name: "مشروع أمن المعلومات",
    beneficiary_organization: "جامعة الأميرة نورة",
    university_project_manager: "د. لطيفة الدوسري",
    technical_responsible_beneficiary: "م. عبير المطيري",
    university_project_team: "فريق أمن المعلومات",
    executing_company_name: "شركة الأمان السيبراني",
    executing_company_project_manager: "م. طارق الحربي",
    executing_company_representative: "أ. شهد الرشيد",
    authorization_number: "AUTH-2024-005",
    project_authorization_date: "2024-02-10",
    project_cost: 450000.00,
    purchase_order_number: "PO-2024-005",
    charter_preparation_date: "2024-02-05",
    project_start_date: "2024-03-15",
    type_of_project_start: "conditional",
    project_duration_days: 150,
    planned_project_end_date: "2024-08-15",
    actual_project_end_date: null,
    site_handover_date: "2024-03-01",
    contract_signing_date: "2024-02-25",
    project_status: "cancelled",
    project_suspension_date: null,
    suspension_duration: null,
    project_resumption_date: null,
    notes: "مشروع تطوير أنظمة أمن المعلومات والحماية السيبرانية"
  }
];

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuState, setActionMenuState] = useState({
    open: false,
    anchorEl: null,
    project: null
  });
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: '',
    project: null,
    data: {}
  });

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
    const matchesStatus = filterStatus === 'all' || project.project_status === filterStatus;
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.beneficiary_organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleActionMenuOpen = (event, project) => {
    event.stopPropagation();
    setActionMenuState({
      open: true,
      anchorEl: event.currentTarget,
      project
    });
  };

  const handleActionMenuClose = () => {
    setActionMenuState({
      open: false,
      anchorEl: null,
      project: null
    });
  };

  const handleActionClick = (actionType) => {
    setActionDialog({
      open: true,
      type: actionType,
      project: actionMenuState.project,
      data: {}
    });
    handleActionMenuClose();
  };

  const handleActionSubmit = () => {
    const { type, project, data } = actionDialog;
    const updatedProjects = projects.map(p => {
      if (p.id === project.id) {
        const updatedProject = { ...p };
        const currentDate = dayjs().format('YYYY-MM-DD');
        
        switch (type) {
          case 'suspend':
            updatedProject.project_status = 'suspended';
            updatedProject.project_suspension_date = currentDate;
            break;
            
          case 'resume':
            updatedProject.project_status = 'in_progress';
            updatedProject.project_resumption_date = currentDate;
            // حساب مدة الإيقاف تلقائياً
            if (updatedProject.project_suspension_date) {
              const suspensionDays = dayjs(currentDate).diff(dayjs(updatedProject.project_suspension_date), 'day');
              updatedProject.suspension_duration = suspensionDays;
              // تحديث تاريخ النهاية المخطط بإضافة مدة الإيقاف
              if (updatedProject.planned_project_end_date) {
                updatedProject.planned_project_end_date = dayjs(updatedProject.planned_project_end_date)
                  .add(suspensionDays, 'day').format('YYYY-MM-DD');
              }
            }
            break;
            
          case 'extend':
            if (data.extensionDays) {
              const extensionDays = parseInt(data.extensionDays);
              updatedProject.project_duration_days += extensionDays;
              // تحديث تاريخ النهاية المخطط
              if (updatedProject.planned_project_end_date) {
                updatedProject.planned_project_end_date = dayjs(updatedProject.planned_project_end_date)
                  .add(extensionDays, 'day').format('YYYY-MM-DD');
              }
            }
            break;
            
          case 'cancel':
            updatedProject.project_status = 'cancelled';
            break;
            
          default:
            break;
        }
        return updatedProject;
      }
      return p;
    });
    
    setProjects(updatedProjects);
    setActionDialog({ open: false, type: '', project: null, data: {} });
  };

  const ProjectCard = ({ project }) => {
    const statusConfig = getStatusConfig(project.project_status);
    
    return (
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
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
              <IconButton
                size="small"
                onClick={(event) => handleActionMenuOpen(event, project)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  مدير المشروع
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Sakkal Majalla' }}>
                {project.university_project_manager}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <MoneyIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  التكلفة
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Sakkal Majalla' }}>
                {formatCurrency(project.project_cost)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  تاريخ البداية
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Sakkal Majalla' }}>
                {formatDate(project.project_start_date)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  المدة
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Sakkal Majalla' }}>
                {project.project_duration_days} يوم
              </Typography>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ViewIcon />}
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              عرض التفاصيل
            </Button>
            <Button
              variant="text"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/projects/${project.id}/edit`)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: 'Sakkal Majalla'
              }}
            >
              تعديل
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const KanbanColumn = ({ status, title, projects }) => {
    const statusConfig = getStatusConfig(status);
    
    return (
      <Paper sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: statusConfig.bg,
        border: `2px solid ${statusConfig.border}`,
        minHeight: 400
      }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{
            bgcolor: statusConfig.color,
            width: 32,
            height: 32
          }}>
            {statusConfig.icon}
          </Avatar>
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
              fontWeight: 600
            }}
          />
        </Box>
        <Stack spacing={2}>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Stack>
      </Paper>
    );
  };

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

          {/* Controls */}
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="البحث في المشاريع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Sakkal Majalla'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ fontFamily: 'Sakkal Majalla' }}>تصفية حسب الحالة</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      label="تصفية حسب الحالة"
                      sx={{
                        borderRadius: 2,
                        fontFamily: 'Sakkal Majalla'
                      }}
                    >
                      <MenuItem value="all">جميع المشاريع</MenuItem>
                      <MenuItem value="planning">تخطيط</MenuItem>
                      <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
                      <MenuItem value="suspended">متوقف</MenuItem>
                      <MenuItem value="completed">مكتمل</MenuItem>
                      <MenuItem value="cancelled">ملغي</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    sx={{
                      '& .MuiToggleButton-root': {
                        borderRadius: 2,
                        fontFamily: 'Sakkal Majalla',
                        fontWeight: 600
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
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Content */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 3, fontFamily: 'Sakkal Majalla' }}>
              {error}
            </Alert>
          ) : (
            <>
              {viewMode === 'list' ? (
                <Grid container spacing={3}>
                  {filteredProjects.map(project => (
                    <Grid item xs={12} md={6} lg={4} key={project.id}>
                      <ProjectCard project={project} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={2.4}>
                    <KanbanColumn
                      status="planning"
                      title="تخطيط"
                      projects={filteredProjects.filter(p => p.project_status === 'planning')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2.4}>
                    <KanbanColumn
                      status="in_progress"
                      title="قيد التنفيذ"
                      projects={filteredProjects.filter(p => p.project_status === 'in_progress')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2.4}>
                    <KanbanColumn
                      status="suspended"
                      title="متوقف"
                      projects={filteredProjects.filter(p => p.project_status === 'suspended')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2.4}>
                    <KanbanColumn
                      status="completed"
                      title="مكتمل"
                      projects={filteredProjects.filter(p => p.project_status === 'completed')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={2.4}>
                    <KanbanColumn
                      status="cancelled"
                      title="ملغي"
                      projects={filteredProjects.filter(p => p.project_status === 'cancelled')}
                    />
                  </Grid>
                </Grid>
              )}
            </>
          )}

          {/* Action Menu */}
          <Menu
            anchorEl={actionMenuState.anchorEl}
            open={actionMenuState.open}
            onClose={handleActionMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
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
            {actionMenuState.project?.project_status !== 'suspended' && 
             actionMenuState.project?.project_status !== 'completed' && 
             actionMenuState.project?.project_status !== 'cancelled' && (
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
            
            {actionMenuState.project?.project_status === 'suspended' && (
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
            
            {(actionMenuState.project?.project_status === 'in_progress' || 
              actionMenuState.project?.project_status === 'planning') && (
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
            
            {actionMenuState.project?.project_status !== 'completed' && 
             actionMenuState.project?.project_status !== 'cancelled' && (
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
            onClose={() => setActionDialog({ open: false, type: '', project: null, data: {} })}
            PaperProps={{
              sx: {
                borderRadius: 4,
                minWidth: 400
              }
            }}
          >
            <DialogTitle sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              textAlign: 'center',
              fontFamily: 'Sakkal Majalla'
            }}>
              {actionDialog.type === 'suspend' && 'إيقاف المشروع'}
              {actionDialog.type === 'resume' && 'استئناف المشروع'}
              {actionDialog.type === 'extend' && 'تمديد المشروع'}
              {actionDialog.type === 'cancel' && 'إلغاء المشروع'}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {actionDialog.type === 'extend' && (
                <TextField
                  fullWidth
                  label="عدد أيام التمديد"
                  type="number"
                  value={actionDialog.data.extensionDays || ''}
                  onChange={(e) => setActionDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, extensionDays: e.target.value }
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
              )}
              {actionDialog.type !== 'extend' && (
                <Typography sx={{ fontFamily: 'Sakkal Majalla', textAlign: 'center' }}>
                  هل أنت متأكد من {actionDialog.type === 'suspend' ? 'إيقاف' : 
                                   actionDialog.type === 'resume' ? 'استئناف' : 'إلغاء'} هذا المشروع؟
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={() => setActionDialog({ open: false, type: '', project: null, data: {} })}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  fontFamily: 'Sakkal Majalla'
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
                  fontFamily: 'Sakkal Majalla'
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