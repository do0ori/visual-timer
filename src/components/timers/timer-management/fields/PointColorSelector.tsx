type PointColorSelectorProps = {
    colors: string[];
    selectedIndex: number;
    onSelect: (index: number) => void;
};

const PointColorSelector: React.FC<PointColorSelectorProps> = ({ colors, selectedIndex, onSelect }) => (
    <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
            <button
                key={index}
                type="button"
                className={`size-10 rounded-full border-2 transition-all ${
                    selectedIndex === index ? 'scale-110 border-white' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onSelect(index)}
            />
        ))}
    </div>
);

export default PointColorSelector;
