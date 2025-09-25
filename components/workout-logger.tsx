"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Weight, Repeat } from "lucide-react"
import type { Exercise } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface Workout {
  id: number;
  name: string;
  date: string;
  notes?: string;
  completed?: boolean;
  duration?: number;
  exercises: Exercise[];
  createdAt?: string;
}

interface WorkoutLoggerProps {
  workout: Workout
  isOpen: boolean
  onClose: () => void
  onComplete: (logData: WorkoutLog) => void
  language: "en" | "th"
  exerciseDatabase: Exercise[]
}

export interface WorkoutLog {
  workoutId: number
  completedAt: string
  duration: number
  exercises: ExerciseLog[]
  notes: string
  overall_effort: number
}

export interface ExerciseLog {
  exerciseId: number
  actualReps?: number
  actualWeight?: number
  actualTime?: number
  effort: number
  notes: string
}

export function WorkoutLogger({ workout, isOpen, onClose, onComplete, language, exerciseDatabase }: WorkoutLoggerProps) {
  const { t } = useTranslation(language)
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(
    workout.exercises.map((ex) => ({
      exerciseId: Number(ex.id),
      actualReps: (ex as any).reps,
      actualWeight: (ex as any).weight,
      actualTime: (ex as any).time,
      effort: 5,
      notes: "",
    })),
  )
  const [overallEffort, setOverallEffort] = useState([5])
  const [workoutNotes, setWorkoutNotes] = useState("")
  const [startTime] = useState(Date.now())

  useEffect(() => {
    console.log("WorkoutLogger - duration from props:", workout.duration)
  }, [workout.duration])

  const updateExerciseLog = (exerciseId: number, updates: Partial<ExerciseLog>) => {
    setExerciseLogs((prev) => prev.map((log) => (log.exerciseId === exerciseId ? { ...log, ...updates } : log)))
  }

  const handleComplete = () => {
    // ใช้ duration จาก workout (ที่ได้จาก timer) หรือจับเวลาเองถ้าไม่มี
    const duration = workout.duration || Math.floor((Date.now() - startTime) / 1000)
    const logData: WorkoutLog = {
      workoutId: Number(workout.id),
      completedAt: new Date().toISOString(),
      duration,
      exercises: exerciseLogs,
      notes: workoutNotes,
      overall_effort: overallEffort[0],
    }
    console.log("WorkoutLogger - duration from timer:", workout.duration)
    console.log("WorkoutLogger - calculated duration:", Math.floor((Date.now() - startTime) / 1000))
    console.log("WorkoutLogger - final duration:", duration)
    console.log("WorkoutLogger - overallEffort:", overallEffort[0])
    console.log("WorkoutLogger - logData:", logData)
    onComplete(logData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            {t("logWorkout")}: {workout.name}
          </DialogTitle>
          <DialogDescription>{t("workoutCompleted")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Logs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("exercises")}</h3>
            {workout.exercises.map((exercise, index) => {
              const log = exerciseLogs.find((l) => l.exerciseId === exercise.id)
              if (!log) return null
              const exData = exerciseDatabase.find(e => e.id === ((exercise as any).exerciseId ?? exercise.id));
              const exerciseName = exData?.name || t('unknownExercise');

              return (
                <Card key={exercise.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>
                        {index + 1}. {exerciseName}
                      </span>
                      <Badge variant="outline">
                        {(exercise as any).sets && `${(exercise as any).sets} ${t("sets")}`}
                        {(exercise as any).reps && ` × ${(exercise as any).reps} ${t("reps")}`}
                        {(exercise as any).time && `${(exercise as any).time}${t("seconds")}`}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(exercise as any).reps && (
                        <div>
                          <Label className="flex items-center">
                            <Repeat className="w-4 h-4 mr-1" />
                            {t("actualReps")}
                          </Label>
                          <Input
                            type="number"
                            value={log.actualReps || ""}
                            onChange={(e) =>
                              updateExerciseLog(Number(exercise.id), {
                                actualReps: Number.parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder={(exercise as any).reps?.toString()}
                          />
                        </div>
                      )}

                      {(exercise as any).weight && (
                        <div>
                          <Label className="flex items-center">
                            <Weight className="w-4 h-4 mr-1" />
                            {t("actualWeight")}
                          </Label>
                          <Input
                            type="number"
                            value={log.actualWeight || ""}
                            onChange={(e) =>
                              updateExerciseLog(Number(exercise.id), {
                                actualWeight: Number.parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder={(exercise as any).weight?.toString()}
                          />
                        </div>
                      )}

                      {(exercise as any).time && (
                        <div>
                          <Label className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {t("actualTime")}
                          </Label>
                          <Input
                            type="number"
                            value={log.actualTime || ""}
                            onChange={(e) =>
                              updateExerciseLog(Number(exercise.id), {
                                actualTime: Number.parseInt(e.target.value) || undefined,
                              })
                            }
                            placeholder={(exercise as any).time?.toString()}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>
                        {t("perceivedEffort")}: {log.effort}/10
                      </Label>
                      <Slider
                        value={[log.effort]}
                        onValueChange={(value) => updateExerciseLog(Number(exercise.id), { effort: value[0] })}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>{t("exerciseNotes")}</Label>
                      <Input
                        value={log.notes}
                        onChange={(e) => updateExerciseLog(Number(exercise.id), { notes: e.target.value })}
                        placeholder={t("howDidThisExerciseFeel")}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Overall Workout */}
          <Card>
            <CardHeader>
              <CardTitle>{t("overallWorkout")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>
                  {t("overallPerceivedEffort")}: {overallEffort[0]}/10
                </Label>
                <Slider
                  value={overallEffort}
                  onValueChange={setOverallEffort}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{t("workoutNotes")}</Label>
                <Textarea
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder={t("howWasYourWorkoutToday")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              {t("saveLog")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
