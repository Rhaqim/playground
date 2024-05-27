import React from "react";
// import { MagnifyingGlass } from '@phosphor-icons/react';

type Data = { [key: string]: any };

type SearchProps<Data> = {
	placeholder: string;
	data: Data[];
	searchFields?: (keyof Data)[];
	callBack?: (text: Data[]) => void;
};

const Search = <T extends Data>({
	placeholder,
	data,
	callBack,
	searchFields,
}: SearchProps<T>) => {
	const handleTextChange = (text: string) => {
		if (callBack) {
			const filteredData = data.filter(item => {
				const valuesToSearch = searchFields
					? searchFields.map(field => item[field])
					: Object.values(item).filter(value => value !== item["_id"]);

				// Check if any value matches the search text
				return valuesToSearch.some(
					value =>
						typeof value === "string" &&
						value.toLowerCase().includes(text.toLowerCase())
				);
			});
			callBack(filteredData as T[]);
		}
	};

	return (
		<div className="rounded-md shadow-sm w-full">
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					{/* <MagnifyingGlass className="h-5 w-5 text-black" /> */}
				</div>
				<input
					type="search"
					onChange={e => handleTextChange(e.target.value)}
					className="block w-full h-10 text-black md:h-12 pl-10 sm:text-sm sm:leading-5 bg-white border border-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F75EF] focus:border-transparent"
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
};

export default Search;
