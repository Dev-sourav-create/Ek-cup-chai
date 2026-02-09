import { ChevronDown } from "lucide-react";

export default function DropDownMenu() {
  return (
    <div className="relative text-sm">
      <button className="peer flex w-full text-left px-4 pr-2 py-2 border rounded-4xl bg-white text-gray-700 border-gray-200 cursor-pointer hover:bg-gray-50 focus:outline-none">
        <span>Open Menu</span>{" "}
        <span>
          <ChevronDown size={18} />
        </span>
      </button>

      <ul className="absolute right-0 hidden peer-focus:block min-w-32 bg-white border border-gray-200 rounded shadow-md mt-2 ">
        <li className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
          New file
        </li>
        <li className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
          Copy link
        </li>
        <li className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer">
          Edit file
        </li>
      </ul>
    </div>
  );
}
