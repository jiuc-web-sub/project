import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/taskService';

function getTaskColorClass(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffHours = (due - now) / (1000 * 60 * 60);
  if (diffHours < 24) return 'task-urgent';
  if (diffHours < 72) return 'task-warning';
  return 'task-normal';
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showDueDate, setShowDueDate] = useState(false);

  useEffect(() => {
    fetchTasks().then(res => {
      if (res.data.code === 0) setTasks(res.data.data);
    });
  }, []);

  // 展开/收起描述
  const [expandedIds, setExpandedIds] = useState([]);

  const handleAddTask = async () => {
    if (!newTask.trim() || !newDueDate) return;
    const res = await createTask({ title: newTask, dueDate: newDueDate, description: newDesc });
    if (res.data.code === 0) {
      setTasks([...tasks, res.data.data]);
      setNewTask('');
      setNewDueDate('');
      setNewDesc('');
      setShowDueDate(false);
    } else {
      alert(res.data.msg || '添加失败');
    }
  };

  const handleDeleteTask = async (id) => {
    const res = await deleteTask(id);
    if (res.data.code === 0) {
      setTasks(tasks.filter(task => task.id !== id));
    } else {
      alert(res.data.msg || '删除失败');
    }
  };

  const handleUpdateDueDate = async (id, value) => {
    const task = tasks.find(t => t.id === id);
    const res = await updateTask(id, { ...task, dueDate: value });
    if (res.data.code === 0) {
      setTasks(tasks.map(t => t.id === id ? { ...t, dueDate: value } : t));
    } else {
      alert(res.data.msg || '修改失败');
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedIds(expandedIds.includes(id)
      ? expandedIds.filter(eid => eid !== id)
      : [...expandedIds, id]);
  };

  const handleDescChange = async (id, value) => {
    const task = tasks.find(t => t.id === id);
    const res = await updateTask(id, { ...task, description: value });
    if (res.data.code === 0) {
      setTasks(tasks.map(t => t.id === id ? { ...t, description: value } : t));
    } else {
      alert(res.data.msg || '修改失败');
    }
  };

  return (
    <div>
      <h1>任务列表</h1>
      <div className="task-add">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="新任务名称"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={e => {
            setNewDueDate(e.target.value);
            setShowDueDate(!!e.target.value);
          }}
          style={{ marginLeft: 8 }}
        />
        <input
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="任务描述"
          style={{ marginLeft: 8, width: 160 }}
        />
        <button onClick={handleAddTask} style={{ marginLeft: 8 }}>添加任务</button>
      </div>
      {showDueDate && newDueDate && (
        <div style={{ margin: '8px 0', color: '#888' }}>
          截止时间：{newDueDate}
        </div>
      )}
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${getTaskColorClass(task.dueDate)}`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <strong>{task.title}</strong>
              <button
                style={{ marginLeft: 'auto', marginRight: 8 }}
                onClick={() => handleToggleExpand(task.id)}
              >
                {expandedIds.includes(task.id) ? '收起' : '展开'}
              </button>
              <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>删除</button>
            </div>
            <div style={{ marginTop: 8 }}>
              截止时间：
              <input
                type="date"
                value={task.dueDate}
                onChange={e => handleUpdateDueDate(task.id, e.target.value)}
                style={{ marginLeft: 4 }}
              />
            </div>
            {expandedIds.includes(task.id) && (
              <div style={{ marginTop: 8 }}>
                <textarea
                  value={task.description || ''}
                  onChange={e => handleDescChange(task.id, e.target.value)}
                  rows={3}
                  style={{ width: '100%' }}
                  placeholder="任务详细描述"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}