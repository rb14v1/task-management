import { useParams } from 'react-router-dom';

export default function TaskDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Task Detail: {id}</h1>
    </div>
  );
}