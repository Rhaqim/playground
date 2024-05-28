// components/DeleteConfirmationModal.tsx
import React, { useState } from "react";

interface DeleteConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	itemName: string;
	onDelete: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
	isOpen,
	onClose,
	itemName,
	onDelete,
}) => {
	const [inputValue, setInputValue] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleDelete = () => {
		if (inputValue === itemName) {
			onDelete();
			onClose();
		} else {
			alert("The name does not match.");
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-6">
				<h2 className="text-lg font-medium leading-6 text-gray-900">
					Confirm Deletion
				</h2>
				<div className="mt-2">
					<p className="text-sm text-center text-gray-500">
						Are you sure you want to delete <strong>{itemName}</strong>? All
						stories associated with this prompt will be deleted. Please type the
						name of the item to confirm.
					</p>
					<input
						type="text"
						value={inputValue}
						onChange={handleChange}
						className="mt-4 w-full p-2 border rounded-md text-black"
						placeholder="Type the name to confirm"
					/>
				</div>
				<div className="mt-4 flex justify-end">
					<button
						type="button"
						className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md mr-2"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						type="button"
						className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
						onClick={handleDelete}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmationModal;
