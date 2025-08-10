import { FiDelete } from 'react-icons/fi'

type deleteConfrimType = {
    onOpen: boolean,
    onClose: () => void
}

const DeleteConfirmation = ({  onClose }: deleteConfrimType) => {
    return (
        <div className='relative flex flex-col border-t-[4px] bg-white border-red-500 justify-center rounded-md shadow-md'>
            <div className='absolute -top-5 left-32 bg-red-500 rounded-full p-2' >
                <FiDelete className='w-7 h-7' />
            </div>
            <div className='flex flex-col gap-3 px-9 py-9 text-center'>
                <span className='font-bold text-[18px]'>Delete Property?</span>
                <span className='text-sm text-[#716f6f]'>Permanently delete the property</span>
            </div>

            <div className='flex w-full flex-row gap-x-10  py-2  justify-between bg-[#F0F0F0]'>
                <button
                    onClick={() => onClose()}
                    className='bg-white rounded-md px-9 py-2'>Cancel</button>
                <button className='bg-red-500 rounded-md px-9 py-2'>Confirm</button>
            </div>

        </div>
    )
}

export default DeleteConfirmation
