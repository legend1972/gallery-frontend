export default function SectionTitle({icon, number, title}) {
    return (
        <div className="section-title">
            <i className={`bi ${icon}`}/>
            <strong>
                {number} {title} 
            </strong>
        </div>
    );
}