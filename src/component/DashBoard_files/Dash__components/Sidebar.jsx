export default function Sidebar({ tags, activeTag, onChange, collapsed }) {
  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      {!collapsed && (
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-4">
          {tags.map((tag,index) => (
            <li key={tag.id || index}>
              <button
                onClick={() => onChange(tag.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTag === tag.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>
                  {tag.icon}
                </span>
                {!collapsed && tag.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          © {new Date().getFullYear()} Your Brand
        </div>
      )}
    </div>
  );
}