type PointColorSelectorProps = {
    colors: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
};

const PointColorSelector: React.FC<PointColorSelectorProps> = ({ colors, selectedIndex, onSelect }) => (
    <div className="flex flex-wrap gap-3 pr-2">
        {colors.map((color, index) => (
            <button
                key={index}
                type="button"
                onClick={() => onSelect(index)}
                className={`relative flex size-12 items-center justify-center rounded-full transition-all ${
                    selectedIndex === index ? 'scale-110' : 'hover:scale-105'
                }`}
            >
                {selectedIndex === index && (
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            boxShadow: `0 0 0 3px white`,
                        }}
                    />
                )}
                <div className="size-10 rounded-full border border-gray-400" style={{ backgroundColor: color }} />
            </button>
        ))}
    </div>
);

export default PointColorSelector;
