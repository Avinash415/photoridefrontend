import "@/styles/search.css";

export default function SearchBar() {
  return (
    <div className="search-box">
      <input type="text" placeholder="Search by city (e.g. Bhilai)" />
      <select>
        <option>All Services</option>
        <option>Wedding</option>
        <option>Event</option>
        <option>Product</option>
        <option>Baby Shoot</option>
      </select>
      <button className="btn">Search</button>
    </div>
  );
}
