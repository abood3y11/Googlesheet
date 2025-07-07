import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Alert,
  Chip,
  Avatar,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  Schedule as ExtendIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Assignment as ProjectIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const ProjectCommands = ({ project, onUpdate, onClose }) => {
  const [activeCommand, setActiveCommand] = useState(null);
  const [formData, setFormData] = useState({
    suspensionDate: dayjs(),
    suspensionDuration: '',
    suspensionReason: '',
    resumptionDate: dayjs(),
    resumptionReason: '',
    extensionDays: '',
    extensionReason: '',
    newEndDate: null,
    cancellationDate: dayjs(),
    cancellationReason: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commands = [
    {
      id: 'suspend',
      title: 'إيقاف المشروع',
      description: 'إيقاف المشروع مؤقتاً مع تحديد مدة الإيقاف',
      icon: <PauseIcon />,
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fed7aa',
      disabled: project.project_status === 'suspended' || project.project_status === 'completed' || project.project_status === 'cancelled'
    },
    {
      id: 'resume',
      title: 'استئناف المشروع',
      description: 'استئناف المشروع المتوقف والعودة للتنفيذ',
      icon: <ResumeIcon />,
      color: '#10b981',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      disabled: project.project_status !== 'suspended'
    },
    {
      id: 'extend',
      title: 'تمديد المشروع',
      description: 'تمديد مدة المشروع وتحديث تاريخ الانتهاء',
      icon: <ExtendIcon />,
      color: '#3b82f6',
      bg: '#eff6ff',
      border: '#bfdbfe',
      disabled: project.project_status === 'completed' || project.project_status === 'cancelled'
    },
    {
      id: 'cancel',
      title: 'إلغاء المشروع',
      description: 'إلغاء المشروع نهائياً وإنهاء جميع الأعمال',
      icon: <CancelIcon />,
      color: '#ef4444',
      bg: '#fef2f2',
      border: '#fecaca',
      disabled: project.project_status === 'completed' || project.project_status === 'cancelled'
    }
  ];

  const handleCommandClick = (commandId) => {
    setActiveCommand(commandId);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      let updatedProject = { ...project };

      switch (activeCommand) {
        case 'suspend':
          if (!formData.suspensionDuration || !formData.suspensionReason) {
            throw new Error('يرجى تعبئة جميع الحقول المطلوبة');
          }
          updatedProject = {
            ...updatedProject,
            project_status: 'suspended',
            project_suspension_date: formData.suspensionDate.format('YYYY-MM-DD'),
            suspension_duration: parseInt(formData.suspensionDuration),
            notes: `${updatedProject.notes || ''}\n\n--- إيقاف المشروع ---\nتاريخ الإيقاف: ${formData.suspensionDate.format('YYYY-MM-DD')}\nمدة الإيقاف: ${formData.suspensionDuration} يوم\nسبب الإيقاف: ${formData.suspensionReason}`.trim()
          };
          break;

        case 'resume':
          if (!formData.resumptionReason) {
            throw new Error('يرجى تحديد سبب الاستئناف');
          }
          updatedProject = {
            ...updatedProject,
            project_status: 'in_progress',
            project_resumption_date: formData.resumptionDate.format('YYYY-MM-DD'),
            notes: `${updatedProject.notes || ''}\n\n--- استئناف المشروع ---\nتاريخ الاستئناف: ${formData.resumptionDate.format('YYYY-MM-DD')}\nسبب الاستئناف: ${formData.resumptionReason}`.trim()
          };
          break;

        case 'extend':
          if (!formData.extensionDays || !formData.extensionReason) {
            throw new Error('يرجى تعبئة جميع الحقول المطلوبة');
          }
          const currentEndDate = dayjs(updatedProject.planned_project_end_date);
          const newEndDate = currentEndDate.add(parseInt(formData.extensionDays), 'day');
          updatedProject = {
            ...updatedProject,
            project_duration_days: updatedProject.project_duration_days + parseInt(formData.extensionDays),
            planned_project_end_date: newEndDate.format('YYYY-MM-DD'),
            notes: `${updatedProject.notes || ''}\n\n--- تمديد المشروع ---\nتاريخ التمديد: ${dayjs().format('YYYY-MM-DD')}\nمدة التمديد: ${formData.extensionDays} يوم\nتاريخ الانتهاء الجديد: ${newEndDate.format('YYYY-MM-DD')}\nسبب التمديد: ${formData.extensionReason}`.trim()
          };
          break;

        case 'cancel':
          if (!formData.cancellationReason) {
            throw new Error('يرجى تحديد سبب الإلغاء');
          }
          updatedProject = {
            ...updatedProject,
            project_status: 'cancelled',
            actual_project_end_date: formData.cancellationDate.format('YYYY-MM-DD'),
            notes: `${updatedProject.notes || ''}\n\n--- إلغاء المشروع ---\nتاريخ الإلغاء: ${formData.cancellationDate.format('YYYY-MM-DD')}\nسبب الإلغاء: ${formData.cancellationReason}`.trim()
          };
          break;

        default:
          throw new Error('أمر غير صحيح');
      }

      await onUpdate(updatedProject);
      setActiveCommand(null);
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      planning: { color: '#3b82f6', label: 'تخطيط', icon: <InfoIcon /> },
      in_progress: { color: '#10b981', label: 'قيد التنفيذ', icon: <CheckCircleIcon /> },
      suspended: { color: '#f59e0b', label: 'متوقف', icon: <WarningIcon /> },
      completed: { color: '#8b5cf6', label: 'مكتمل', icon: <CheckCircleIcon /> },
      cancelled: { color: '#ef4444', label: 'ملغي', icon: <CancelIcon /> }
    };
    return configs[status] || configs.planning;
  };

  const statusConfig = getStatusConfig(project.project_status);

  const renderCommandForm = () => {
    switch (activeCommand) {
      case 'suspend':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="تاريخ الإيقاف"
                value={formData.suspensionDate}
                onChange={(value) => handleInputChange('suspensionDate', value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="مدة الإيقاف (بالأيام)"
                type="number"
                value={formData.suspensionDuration}
                onChange={(e) => handleInputChange('suspensionDuration', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="سبب الإيقاف"
                multiline
                rows={3}
                value={formData.suspensionReason}
                onChange={(e) => handleInputChange('suspensionReason', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );

      case 'resume':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="تاريخ الاستئناف"
                value={formData.resumptionDate}
                onChange={(value) => handleInputChange('resumptionDate', value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="سبب الاستئناف"
                multiline
                rows={3}
                value={formData.resumptionReason}
                onChange={(e) => handleInputChange('resumptionReason', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );

      case 'extend':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="مدة التمديد (بالأيام)"
                type="number"
                value={formData.extensionDays}
                onChange={(e) => handleInputChange('extensionDays', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="تاريخ الانتهاء الجديد"
                value={
                  formData.extensionDays && project.planned_project_end_date
                    ? dayjs(project.planned_project_end_date)
                        .add(parseInt(formData.extensionDays || 0), 'day')
                        .format('YYYY-MM-DD')
                    : ''
                }
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="سبب التمديد"
                multiline
                rows={3}
                value={formData.extensionReason}
                onChange={(e) => handleInputChange('extensionReason', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );

      case 'cancel':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="تاريخ الإلغاء"
                value={formData.cancellationDate}
                onChange={(value) => handleInputChange('cancellationDate', value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="سبب الإلغاء"
                multiline
                rows={3}
                value={formData.cancellationReason}
                onChange={(e) => handleInputChange('cancellationReason', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 3
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <ProjectIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Sakkal Majalla' }}>
              أوامر تغيير المشروع
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: 'Sakkal Majalla' }}>
              {project.project_name}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {/* Project Status */}
        <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Sakkal Majalla' }}>
                الحالة الحالية للمشروع
              </Typography>
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                sx={{
                  bgcolor: `${statusConfig.color}20`,
                  color: statusConfig.color,
                  fontWeight: 600,
                  fontFamily: 'Sakkal Majalla'
                }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  <strong>تاريخ البداية:</strong> {project.project_start_date ? dayjs(project.project_start_date).format('YYYY-MM-DD') : 'غير محدد'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  <strong>تاريخ الانتهاء المخطط:</strong> {project.planned_project_end_date ? dayjs(project.planned_project_end_date).format('YYYY-MM-DD') : 'غير محدد'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  <strong>مدة المشروع:</strong> {project.project_duration_days || 0} يوم
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Sakkal Majalla' }}>
                  <strong>التكلفة:</strong> {new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: 'SAR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(project.project_cost || 0)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {!activeCommand ? (
          /* Command Selection */
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, fontFamily: 'Sakkal Majalla' }}>
              اختر الأمر المطلوب تنفيذه:
            </Typography>
            <Grid container spacing={3}>
              {commands.map((command) => (
                <Grid item xs={12} sm={6} key={command.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `2px solid ${command.disabled ? '#e5e7eb' : command.border}`,
                      bgcolor: command.disabled ? '#f9fafb' : command.bg,
                      cursor: command.disabled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: command.disabled ? 0.6 : 1,
                      '&:hover': command.disabled ? {} : {
                        borderColor: command.color,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${command.color}20`
                      }
                    }}
                    onClick={() => !command.disabled && handleCommandClick(command.id)}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar sx={{
                        bgcolor: command.color,
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2
                      }}>
                        {command.icon}
                      </Avatar>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: command.disabled ? 'text.disabled' : command.color,
                          mb: 1,
                          fontFamily: 'Sakkal Majalla'
                        }}
                      >
                        {command.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: command.disabled ? 'text.disabled' : 'text.secondary',
                          fontFamily: 'Sakkal Majalla'
                        }}
                      >
                        {command.description}
                      </Typography>
                      {command.disabled && (
                        <Chip
                          label="غير متاح"
                          size="small"
                          sx={{
                            mt: 2,
                            bgcolor: 'grey.200',
                            color: 'grey.600',
                            fontFamily: 'Sakkal Majalla'
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          /* Command Form */
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Button
                variant="outlined"
                onClick={() => setActiveCommand(null)}
                sx={{ fontFamily: 'Sakkal Majalla' }}
              >
                العودة
              </Button>
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Sakkal Majalla' }}>
                {commands.find(c => c.id === activeCommand)?.title}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontFamily: 'Sakkal Majalla' }}>
                {error}
              </Alert>
            )}

            {renderCommandForm()}

            <Box mt={3}>
              <TextField
                fullWidth
                label="ملاحظات إضافية"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': { fontFamily: 'Sakkal Majalla' },
                  '& .MuiInputBase-input': { fontFamily: 'Sakkal Majalla' }
                }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      {activeCommand && (
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setActiveCommand(null)}
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
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: commands.find(c => c.id === activeCommand)?.color,
              fontFamily: 'Sakkal Majalla',
              '&:hover': {
                background: commands.find(c => c.id === activeCommand)?.color,
                filter: 'brightness(0.9)'
              }
            }}
          >
            {loading ? 'جاري التنفيذ...' : 'تنفيذ الأمر'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ProjectCommands;