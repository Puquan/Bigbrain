import React from 'react'

interface Props {
  items: string[];
  heading: string;
}

function QuizList ({ items, heading }: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)

  const handleClick = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    console.log(e.currentTarget.innerText)
    setSelectedIndex(index);
  }

  return (
    <>
    <h1>{heading}</h1>
    {items.length === 0 && <p>No items found</p>}
    <ul className="list-group">
      {items.map((item, index) => (
        <li key={item + index} className={
          selectedIndex === index ? 'list-group-item active' : 'list-group-item'
        } onClick={(event) => handleClick(event, index)}>
        {item}</li>))}
    </ul>
    </>
  )
}

export default QuizList
