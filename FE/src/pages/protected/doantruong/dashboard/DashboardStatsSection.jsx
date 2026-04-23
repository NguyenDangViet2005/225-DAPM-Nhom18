const DashboardStatsSection = ({ stats }) => {
  return (
    <section className="dashboard-stats">
      {stats.map((stat, i) => (
        <div key={i} className="stat-card">
          <div className="stat-card__top">
            <div
              className="stat-card__icon"
              style={{
                backgroundColor: `${stat.color}18`,
                color: stat.color,
              }}
            >
              <stat.icon size={22} />
            </div>
            <span
              className="stat-card__trend"
              style={{
                color: stat.color,
                backgroundColor: `${stat.color}12`,
              }}
            >
              {stat.trend}
            </span>
          </div>
          <p className="stat-card__label">{stat.title}</p>
          <p className="stat-card__value">{stat.value}</p>
          <p className="stat-card__sub">{stat.trend}</p>
        </div>
      ))}
    </section>
  );
};

export default DashboardStatsSection;
