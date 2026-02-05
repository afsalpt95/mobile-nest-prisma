"use client";
import { Trash2 } from 'lucide-react';
import { HiPencil } from "react-icons/hi2";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
}

const EditDeleteIcon: React.FC<Props> = ({ onDelete, onEdit}) => {
  return (
    <div className='flex gap-4 items-center text-text-secondary'>
        <button onClick={onEdit} className='cursor-pointer hover:text-red-700 transition'>
            <HiPencil size={16}/>
        </button>

    <button onClick={onDelete} className='cursor-pointer hover:text-red-700 transition'>
            <Trash2 size={16}/>
        </button>

    </div>
  )
}

export default EditDeleteIcon
