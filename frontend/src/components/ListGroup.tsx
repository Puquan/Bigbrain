import React from 'react';
function ListGroup () {
  const items = ['city1', 'city2', 'city3'];
  const [selectIndex, setSelectIndex] = React.useState(-1);

  return (
    <>
      <h1>List</h1>
      {items.length === 0 && <p>There are no items in the list.</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              index === selectIndex
                ? 'list-group-item active'
                : 'list-group-item'
            }
            onClick={() => setSelectIndex(index)}
            key={item}
          >
            {item} + {index}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
