import React from 'react';

function StartBlock({ block }) {
    const isUnconnected = !block.parentId && !block.childId;    
    const style = {
        padding: '35px 12px',
        backgroundColor: block.color || '#3498DB',
        opacity: isUnconnected ? 0.6 : 1,
        color: 'white',
        width: '150px',
        borderRadius: '10px 10px 5px 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    };

    return (
        <div style={style}>
        <div style={{ fontWeight: 'bold' }}>{block.label || 'Start'}</div>
        </div>
    );
}

export default StartBlock;
