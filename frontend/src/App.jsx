
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasktitle, setTasktitle] = useState('')
  const [tasks, setTasks] = useState([])
  const [taskpriority, setTaskpriority] = useState('Medium')
  const [taskdeadline, setTaskdeadline] = useState('')

  const [taskfilter, setTaskfilter] = useState('All')

  const [tasksearch, setTasksearch] = useState('')

const [tasksort, setTasksort] = useState('Default')
const [priorityfilter, setPriorityfilter] = useState('All')




const totaltasks = tasks.length
const completedtasks = tasks.filter(
  (task) => task.status === 'Completed'
).length

const pendingtasks = tasks.filter(
  (task) => task.status === 'Pending'
).length
const progress = totaltasks === 0
  ? 0
  : Math.round((completedtasks / totaltasks) * 100)
const filteredtasks = tasks.filter((task) => {
  const matchesstatus =
    taskfilter === 'All' || task.status === taskfilter

  const matchessearch = task.title
    .toLowerCase()
    .includes(tasksearch.toLowerCase())

  const matchespriority =
    priorityfilter === 'All' ||
    task.priority === priorityfilter

  return matchesstatus && matchessearch && matchespriority
})
const taskstoday = tasks.filter((task) =>
  task.deadline === new Date().toLocaleDateString('en-CA') &&
  task.status !== 'Completed'
).length
  // Load tasks from database
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch('http://127.0.0.1:8000/tasks')

        if (!response.ok) {
          throw new Error('Failed to load tasks')
        }

        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    }

    loadTasks()
  }, [])
const overduetasks = tasks.filter((task) =>
  task.deadline &&
  task.deadline < new Date().toLocaleDateString('en-CA') &&
  task.status !== 'Completed'
).length
  // Add task
  async function addTask() {
    if (tasktitle.trim() === '') {
      alert('Please enter a task')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: tasktitle.trim(),
          description: '',
          priority: taskpriority,
          deadline: taskdeadline,
          status: 'Pending'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save task')
      }

      
const data = await response.json()

setTasks((currenttasks) => [...currenttasks, data.task])

setTasktitle('')
setTaskpriority('Medium')
setTaskdeadline('')

alert('Task added successfully!')

    } catch (error) {
      console.error(error)
      alert('Could not add task')
    }
  }
  async function clearCompletedTasks() {
  const completed = tasks.filter(
    (task) => task.status === 'Completed'
  )

  if (completed.length === 0) {
    alert('No completed tasks to clear')
    return
  }

  const confirmed = window.confirm(
    `Delete ${completed.length} completed task(s)?`
  )

  if (!confirmed) return

  try {
    for (const task of completed) {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to delete a task')
      }

      setTasks((currenttasks) =>
        currenttasks.filter((item) => item.id !== task.id)
      )
    }

    alert('Completed tasks cleared!')
  } catch (error) {
    console.error(error)
    alert('Some tasks could not be deleted')
  }
}
  // Delete task
  async function deleteTask(taskid) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${taskid}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks((currenttasks) =>
        currenttasks.filter((task) => task.id !== taskid)
      )

      alert('Task deleted successfully!')
    } catch (error) {
      console.error(error)
      alert('Could not delete task')
    }
  }

  // Complete task
  async function completeTask(task) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'Medium',
            deadline: task.deadline || '',
status: 'Completed',
completedat: new Date().toLocaleDateString('en-CA')
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to complete task')
      }

      setTasks((currenttasks) =>
        currenttasks.map((item) =>
          item.id === task.id
            ? {
    ...item,
    status: 'Completed',
    completedat: new Date().toLocaleDateString('en-CA')
  }
            : item
        )
      )

      alert('Task completed successfully!')
    } catch (error) {
      console.error(error)
      alert('Could not complete task')
    }
  }

  return (
    <div>
      <h1>AI Smart Daily Planner</h1>

      <p>Plan your day, organize tasks, and stay productive!</p>

      <h2>My Dashboard</h2>

<div className="dashboardstats">
  <div className="statcard">
    <h3>Total Tasks</h3>
    <h2>{totaltasks}</h2>
  </div>

  <div className="statcard">
    <h3>Completed Tasks</h3>
    <h2>{completedtasks}</h2>
  </div>

  <div className="statcard">
    <h3>Pending Tasks</h3>
    <h2>{pendingtasks}</h2>
  </div>
</div>


      <div>
        <h3>Add New Task</h3>

        <input
          type="text"
          placeholder="Enter your task"
          value={tasktitle}
          onChange={(event) => setTasktitle(event.target.value)}
        />
        <div className="progress-section">
  <h3>Task Progress: {progress}%</h3>

  <progress value={progress} max="100" />
</div>
<select
  value={taskpriority}
  onChange={(event) => setTaskpriority(event.target.value)}
>
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Low">Low</option>
</select>

<input
  type="date"
  value={taskdeadline}
  onChange={(event) => setTaskdeadline(event.target.value)}
/>


        <button type="button" onClick={addTask}>
          Add Task
        </button>
      </div>

      <h3>My Tasks</h3>
      <p>
  📅 Tasks Due Today: {taskstoday}
</p>
<p style={{ color: 'red', fontWeight: 'bold' }}>
  ⚠️ Overdue Tasks: {overduetasks}
</p>
<p>
  {progress === 100 && totaltasks > 0
    ? '🎉 Amazing! You completed all your tasks!'
    : progress >= 50
    ? '👏 Great progress! Keep going!'
    : '💪 Keep going! You can do it!'}
</p>
<button
  type="button"
  onClick={clearCompletedTasks}
  disabled={completedtasks === 0}
>
  Clear Completed Tasks
</button>

<div className="tasksearch">
  <input
    type="text"
    placeholder="Search tasks..."
    value={tasksearch}
    onChange={(event) => setTasksearch(event.target.value)}
  />
<select
  value={priorityfilter}
  onChange={(event) => setPriorityfilter(event.target.value)}
>
  <option value="All">All Priorities</option>
  <option value="High">High Priority</option>
  <option value="Medium">Medium Priority</option>
  <option value="Low">Low Priority</option>
</select>
  {tasksearch && (
    <button
      type="button"
      onClick={() => setTasksearch('')}
    >
      Clear
    </button>
  )}
</div>



<div className="taskfilters">
  {['All', 'Pending', 'Completed'].map((filter) => (
    <button
      key={filter}
      type="button"
      className={taskfilter === filter ? 'activefilter' : ''}
      onClick={() => setTaskfilter(filter)}
    >
      {filter === 'All' ? 'All Tasks' : filter}
    </button>
  ))}
</div>

<div className="tasksorting">
  <label htmlFor="tasksort">Sort Tasks: </label>

  <select
    id="tasksort"
    value={tasksort}
    onChange={(event) => setTasksort(event.target.value)}
  >
    <option value="Default">Default Order</option>
    <option value="Priority">Priority: High to Low</option>
    <option value="Deadline">Deadline: Earliest First</option>
  </select>
</div>
<p>
  Showing {filteredtasks.length} of {tasks.length} tasks
</p>
<button
  type="button"
  onClick={() => {
    setTasksearch('')
    setTaskfilter('All')
    setPriorityfilter('All')
    setTasksort('Default')
  }}
>
  Reset Filters
</button>
<ul>

  {[...filteredtasks]
  .sort((first, second) => {
    if (tasksort === 'Priority') {
      const priorityorder = {
        High: 1,
        Medium: 2,
        Low: 3
      }

      return (
        (priorityorder[first.priority] ?? 2) -
        (priorityorder[second.priority] ?? 2)
      )
    }

    if (tasksort === 'Deadline') {
      if (!first.deadline) return second.deadline ? 1 : 0
      if (!second.deadline) return -1

      return first.deadline.localeCompare(second.deadline)
    }

    return 0
  })
  .map((task) => (



          <li key={task.id}>
            

<div className="taskinfo">
  <strong>{task.title}</strong>

  <span> {task.status} </span>

  <span className={`priority ${task.priority?.toLowerCase() || 'medium'}`}>
    {task.priority || 'Medium'} Priority
  </span>
  {task.status === 'Completed' && task.completedat && (
  <span style={{ color: 'green', fontWeight: 'bold' }}>
    Completed on: {task.completedat}
  </span>
)}
  {task.deadline && (
  <span className="taskdeadline">
    Deadline: {task.deadline}
  </span>
)}
  {task.deadline &&
  task.deadline < new Date().toLocaleDateString('en-CA') &&
  task.status !== 'Completed' && (
    <span style={{ color: 'red', fontWeight: 'bold' }}>
      Overdue
    </span>
    
  )}
  {task.deadline === new Date().toLocaleDateString('en-CA') &&
  task.status !== 'Completed' && (
    <span style={{ color: 'orange', fontWeight: 'bold' }}>
      Due Today
    </span>
  )}
</div>


            {' '}

            {task.status !== 'Completed' && (
              <button
                type="button"
                onClick={() => completeTask(task)}
              >
                Complete
              </button>
            )}

            {' '}

            <button
              type="button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

{filteredtasks.length === 0 && tasks.length > 0 && (
  <p className="noresults">
    No matching tasks found.
  </p>
)}


      {tasks.length === 0 && (
        <p>No tasks yet. Add your first task!</p>
      )}

      <p>Welcome to your personal task planner.</p>
    </div>
  )
}

export default App
