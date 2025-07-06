import { Box, Typography, Stack } from '@mui/material'
import { useContext } from 'react'
import { TimezoneContext } from '../contexts/TimezoneContext'
import { TimezoneListItem } from './TimezoneListItem'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

export const TimezoneList = () => {
  const context = useContext(TimezoneContext)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (!context) {
    return null
  }

  const { timezones, setTimezones } = context

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = timezones.indexOf(active.id as string)
      const newIndex = timezones.indexOf(over.id as string)
      setTimezones(arrayMove(timezones, oldIndex, newIndex))
    }
  }

  return (
    <Box component="section" sx={{ mb: 2 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={timezones}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={2}>
            {timezones.map((timezone) => (
              <TimezoneListItem key={timezone} timezone={timezone} />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    </Box>
  )
}
