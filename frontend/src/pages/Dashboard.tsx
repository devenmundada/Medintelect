import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { GlassCard } from '../components/layout/GlassCard';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Toggle } from '../components/ui/Toggle';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Users,
  Activity,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  MessageSquare,
  Eye,
  Download,
  Filter,
  MoreVertical,
  Bell,
  Settings
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const stats = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Avg. Response Time',
      value: '2.4s',
      change: '-15%',
      trend: 'down',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Accuracy Rate',
      value: '96.2%',
      change: '+0.5%',
      trend: 'up',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Cases',
      value: '84',
      change: '+3',
      trend: 'up',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'analysis',
      title: 'Chest X-ray Analysis',
      patient: 'John Smith',
      time: '10 min ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'consultation',
      title: 'Video Consultation',
      patient: 'Sarah Johnson',
      time: '25 min ago',
      status: 'in-progress',
    },
    {
      id: 3,
      type: 'report',
      title: 'Lab Report Review',
      patient: 'Michael Chen',
      time: '1 hour ago',
      status: 'pending',
    },
    {
      id: 4,
      type: 'analysis',
      title: 'MRI Analysis',
      patient: 'Emma Wilson',
      time: '2 hours ago',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Clinical Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Overview of your clinical activities and analytics
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="ghost" size="sm" leftIcon={<Bell className="w-4 h-4" />}>
              Notifications
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
              Settings
            </Button>
            <Button leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline mt-2">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {stat.value}
                    </span>
                    <div className="flex items-center ml-3">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`ml-1 text-sm ${
                          stat.trend === 'up'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <div className={stat.color.replace('bg-', 'text-')}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Controls */}
          <div className="lg:col-span-2">
            {/* Progress Metrics */}
            <GlassCard className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Performance Metrics
                </h2>
                <div className="flex items-center space-x-4">
                  <Toggle
                    enabled={showHeatmap}
                    onChange={setShowHeatmap}
                    label="Heatmap"
                    size="sm"
                  />
                  <Toggle
                    enabled={autoRefresh}
                    onChange={setAutoRefresh}
                    label="Auto-refresh"
                    size="sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <ProgressRing percentage={96} size="lg" label="Diagnostic Accuracy" />
                </div>
                <div className="text-center">
                  <ProgressRing percentage={88} size="lg" label="Response Rate" />
                </div>
                <div className="text-center">
                  <ProgressRing percentage={92} size="lg" label="Patient Satisfaction" />
                </div>
                <div className="text-center">
                  <ProgressRing percentage={85} size="lg" label="Efficiency Score" />
                </div>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Recent Activity
                </h2>
                <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 mr-4">
                      {activity.type === 'analysis' && (
                        <Eye className="w-5 h-5 text-primary-600" />
                      )}
                      {activity.type === 'consultation' && (
                        <MessageSquare className="w-5 h-5 text-primary-600" />
                      )}
                      {activity.type === 'report' && (
                        <FileText className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Patient: {activity.patient}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          activity.status === 'completed'
                            ? 'success'
                            : activity.status === 'in-progress'
                            ? 'warning'
                            : 'outline'
                        }
                      >
                        {activity.status}
                      </Badge>
                      <span className="text-sm text-neutral-500">
                        {activity.time}
                      </span>
                      <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                        <MoreVertical className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Quick Actions & Calendar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button fullWidth leftIcon={<Eye className="w-4 h-4" />}>
                  New Image Analysis
                </Button>
                <Button variant="secondary" fullWidth leftIcon={<MessageSquare className="w-4 h-4" />}>
                  Start Consultation
                </Button>
                <Button variant="secondary" fullWidth leftIcon={<FileText className="w-4 h-4" />}>
                  Generate Report
                </Button>
                <Button variant="ghost" fullWidth leftIcon={<Calendar className="w-4 h-4" />}>
                  Schedule Appointment
                </Button>
              </div>
            </GlassCard>

            {/* Upcoming Appointments */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                Upcoming Appointments
              </h2>
              <div className="space-y-4">
                {[
                  { time: '10:00 AM', patient: 'Robert Brown', type: 'Follow-up' },
                  { time: '11:30 AM', patient: 'Lisa Wang', type: 'Consultation' },
                  { time: '2:00 PM', patient: 'David Miller', type: 'Diagnostic' },
                ].map((appointment, index) => (
                  <div
                    key={index}
                    className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {appointment.time}
                      </div>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {appointment.patient}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* System Status */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                System Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    AI Models
                  </span>
                  <Badge variant="success">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Database
                  </span>
                  <Badge variant="success">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    API Services
                  </span>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Storage
                  </span>
                  <Badge variant="warning">84% Used</Badge>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
};