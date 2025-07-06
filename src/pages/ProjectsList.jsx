import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Fade,
  Skeleton
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null });
  const navigate = useNavigate();

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
    try {
      await projectsAPI.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      setDeleteDialog({ open: false, project: null });
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      planning: 'default',
      in_progress: 'primary',
      suspended: 'warning',
      completed: 'success',
      cancelled: 'error',
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      planning: 'تخطيط',
      in_progress: 'قيد التنفيذ',
      suspended: 'متوقف',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    };
    return statusLabels[status] || status;
  };

  const columns = [
    {
      field: 'id',
      headerName: 'المعرف',
      width: 80,
    },
    {
      field: 'project_name',
      headerName: 'اسم المشروع',
      width: 200,
      flex: 1,
    },
    {
      field: 'beneficiary_organization',
      headerName: 'الجهة المستفيدة',
      width: 180,
    },
    {
      field: 'university_project_manager',
      headerName: 'مدير المشروع',
      width: 150,
    },
    {
      field: 'project_cost',
      headerName: 'التكلفة',
      width: 120,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('ar-SA', {
          style: 'currency',
          currency: 'SAR',
        }).format(params || 0);
      },
    },
    {
      field: 'project_status',
      headerName: 'الحالة',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'project_start_date',
      headerName: 'تاريخ البداية',
      width: 120,
      valueFormatter: (params) => {
        return params ? new Date(params).toLocaleDateString('ar-SA') : '';
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'الإجراءات',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="عرض"
          onClick={() => navigate(`/projects/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="تعديل"
          onClick={() => navigate(`/projects/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="حذف"
          onClick={() => setDeleteDialog({ open: true, project: params.row })}
        />,
      ],
    },
  ];

  // Calculate statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.project_status === 'مكتمل').length;
  const inProgressProjects = projects.filter(p => p.project_status === 'قيد التنفيذ').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.project_cost || 0), 0);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          قائمة المشاريع
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            قائمة المشاريع
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            مشروع جديد
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {totalProjects}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      إجمالي المشاريع
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {completedProjects}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      مشاريع مكتملة
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {inProgressProjects}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      قيد التنفيذ
                    </Typography>
                  </Box>
                  <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {(totalBudget / 1000000).toFixed(1)}م
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      إجمالي الميزانية
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={projects}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-main': {
                    direction: 'rtl',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.9rem',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8fafc',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '2px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, project: null })}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: 400,
            }
          }}
        >
          <DialogTitle sx={{
            fontWeight: 600,
            fontSize: '1.25rem',
            pb: 1,
            borderBottom: '1px solid #e2e8f0'
          }}>
            تأكيد الحذف
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Typography>
              هل أنت متأكد من حذف المشروع "{deleteDialog.project?.project_name}"؟
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setDeleteDialog({ open: false, project: null })}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={() => handleDelete(deleteDialog.project?.id)}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                }
              }}
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ProjectsList;
