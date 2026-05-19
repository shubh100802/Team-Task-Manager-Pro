import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const columns = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export default function KanbanBoard({ tasks, onTaskClick, onStatusChange, canDrag }) {
  const groupedTasks = columns.reduce((accumulator, column) => {
    accumulator[column.id] = tasks.filter((task) => task.status === column.id);
    return accumulator;
  }, {});

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const nextStatus = result.destination.droppableId;
    const taskId = result.draggableId;

    if (nextStatus !== result.source.droppableId) {
      onStatusChange(taskId, nextStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <Droppable droppableId={column.id} key={column.id} isDropDisabled={!canDrag}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-white">{column.title}</h3>
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                    {groupedTasks[column.id].length}
                  </span>
                </div>
                <div className="space-y-3">
                  {groupedTasks[column.id].map((task, index) => (
                    <Draggable draggableId={task.id} index={index} key={task.id} isDragDisabled={!canDrag}>
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <TaskCard task={task} onClick={onTaskClick} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
