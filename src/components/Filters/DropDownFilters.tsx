type DropDownFiltersProps = {
	onClose: () => void
}

export function DropDownFilters({ onClose }: DropDownFiltersProps) {
	return (
		<div className='flex flex-col h-full bg-white'>
			{/* Header */}
			<header className='flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10'>
				<button onClick={onClose} className='text-2xl font-light'>
					&times;
				</button>
				<h2 className='text-lg font-semibold'>Filters</h2>
				<button className='text-sm text-gray-600 hover:text-black'>
					Reset
				</button>
			</header>

			{/* Body with scrollable content */}
			<main className='flex-grow p-4 overflow-y-auto'>
				{/* Category Section */}
				<div className='mb-6'>
					<h3 className='font-semibold mb-3'>Category</h3>
					<div className='space-y-3'>
						<label className='flex items-center'>
							<input
								type='checkbox'
								className='h-4 w-4 rounded border-gray-300 text-black focus:ring-black'
							/>
							<span className='ml-2 text-gray-700'>Electronics</span>
						</label>
						<label className='flex items-center'>
							<input
								type='checkbox'
								className='h-4 w-4 rounded border-gray-300 text-black focus:ring-black'
								defaultChecked
							/>
							<span className='ml-2 text-gray-700'>Furniture</span>
						</label>
						<label className='flex items-center'>
							<input
								type='checkbox'
								className='h-4 w-4 rounded border-gray-300 text-black focus:ring-black'
							/>
							<span className='ml-2 text-gray-700'>Clothing</span>
						</label>
					</div>
				</div>

				{/* Price Range Section */}
				<div className='mb-6'>
					<h3 className='font-semibold mb-3'>Price Range</h3>
					<div className='flex items-center space-x-2'>
						<input
							type='number'
							placeholder='Min'
							className='w-full p-2 border rounded-md'
						/>
						<span className='text-gray-400'>-</span>
						<input
							type='number'
							placeholder='Max'
							className='w-full p-2 border rounded-md'
						/>
					</div>
				</div>

				{/* Location Section */}
				<div className='mb-6'>
					<h3 className='font-semibold mb-3'>Location</h3>
					<select className='w-full p-2 border rounded-md bg-white'>
						<option>All Countries</option>
						<option>Ukraine</option>
						<option>Poland</option>
						<option>Germany</option>
					</select>
				</div>

				{/* Condition Section */}
				<div>
					<h3 className='font-semibold mb-3'>Condition</h3>
					<div className='flex space-x-4'>
						<label className='flex items-center'>
							<input
								type='radio'
								name='condition'
								className='h-4 w-4 text-black border-gray-300 focus:ring-black'
							/>
							<span className='ml-2 text-gray-700'>New</span>
						</label>
						<label className='flex items-center'>
							<input
								type='radio'
								name='condition'
								className='h-4 w-4 text-black border-gray-300 focus:ring-black'
							/>
							<span className='ml-2 text-gray-700'>Used</span>
						</label>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className='p-4 border-t sticky bottom-0 bg-white z-10'>
				<button
					onClick={onClose}
					className='w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors'
				>
					Show 1,234 items
				</button>
			</footer>
		</div>
	)
}
