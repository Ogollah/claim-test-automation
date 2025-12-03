'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { deleteScheduleById, getSchedules, toggleSchedule, runSchedule } from '@/lib/api';

interface Schedule {
  id: number
  schedule_type: string
  schedule_time: string
  is_active: boolean
  email_recipients: string[]
  test_config: any
  created_at: string
}

interface ScheduleListProps {
  compact?: boolean;
  refreshKey?: number;
  onScheduleUpdate?: () => void;
  onScheduleDelete?: () => void;
}

export default function ScheduleList({ compact = false, refreshKey, onScheduleUpdate, onScheduleDelete }: ScheduleListProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [refreshKey])
  const fetchSchedules = async () => {
    try {
      const response = await getSchedules();
      const schedules: Schedule[] = response;
      if (!Array.isArray(schedules)) {
        toast.error("Invalid data format received.");
        return;
      }
      setSchedules(schedules)
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
      toast.error("Failed to load schedules.");
    } finally {
      setLoading(false)
    }
  }

  // Fixed: Using the imported API function instead of creating infinite recursion
  const handleToggleSchedule = async (id: number, currentStatus: boolean) => {
    try {
      await toggleSchedule(id, !currentStatus);
      setSchedules(prev => prev.map(schedule =>
        schedule.id === id ? { ...schedule, is_active: !currentStatus } : schedule
      ))
      toast.info(`Schedule ${id} has been ${currentStatus ? 'paused' : 'activated'}.`)
      onScheduleUpdate?.(); // Call callback if provided
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error("Failed to update schedule.")
    }
  }

  // Fixed: Added proper error handling and callback
  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return

    try {
      await deleteScheduleById(id);
      setSchedules(prev => prev.filter(schedule => schedule.id !== id))
      toast.success("Schedule has been deleted successfully.")
      onScheduleDelete?.(); // Call callback if provided
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast.error("Failed to delete schedule.")
    }
  }

  // Fixed: Using the imported API function
  const handleRunScheduleNow = async (id: number) => {
    try {
      await runSchedule(id);
      toast.success("Manual execution initiated for this schedule.")
    } catch (error) {
      console.error('Failed to start tests:', error);
      toast.error("Failed to start tests.")
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading schedules...</div>
  }

  if (schedules.length === 0) {
    return <div className="text-center py-4">No schedules found.</div>
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {schedules.slice(0, 5).map((schedule) => (
          <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Badge variant={schedule.is_active ? "default" : "secondary"} className={schedule.is_active ? 'bg-green-900' : 'bg-gray-500'}>
                {schedule.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <div>
                <p className="font-medium capitalize">{schedule.schedule_type} at {schedule.schedule_time}</p>
                <p className="text-sm text-muted-foreground">
                  {schedule.email_recipients.length} recipients
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRunScheduleNow(schedule.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  Run Now
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleSchedule(schedule.id, schedule.is_active)}>
                  {schedule.is_active ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>
                <Badge variant={schedule.is_active ? "default" : "secondary"} className={schedule.is_active ? 'bg-green-900' : 'bg-gray-500'}>
                  {schedule.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{schedule.schedule_type}</TableCell>
              <TableCell>{schedule.schedule_time}</TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate" title={schedule.email_recipients.join(', ')}>
                  {schedule.email_recipients.join(', ')}
                </div>
              </TableCell>
              <TableCell>
                {new Date(schedule.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRunScheduleNow(schedule.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Run Now
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleSchedule(schedule.id, schedule.is_active)}>
                      {schedule.is_active ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}