import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PracticeSession } from '../../../models/practice';

interface PracticeChartsProps {
  sessions: PracticeSession[];
}

const CATEGORY_COLORS: Record<string, string> = {
  scale: '#8b5cf6',
  repertoire: '#3b82f6',
  technical: '#10b981',
  'sight-reading': '#f59e0b',
  theory: '#ef4444',
  'ear-training': '#ec4899',
};

export function PracticeCharts({ sessions }: PracticeChartsProps) {
  // Calculate daily practice time for last 30 days
  const getLast30DaysData = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Create a map of all dates in the last 30 days
    const dateMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
    }

    // Add actual practice time
    sessions.forEach((session) => {
      if (dateMap.has(session.date)) {
        dateMap.set(session.date, (dateMap.get(session.date) || 0) + session.durationMinutes);
      }
    });

    // Convert to array and sort
    return Array.from(dateMap.entries())
      .map(([date, minutes]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        minutes,
      }))
      .reverse();
  };

  // Calculate time by category
  const getCategoryData = () => {
    const categoryMap = new Map<string, number>();

    sessions.forEach((session) => {
      session.items.forEach((item) => {
        const current = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, current + session.durationMinutes / session.items.length);
      });
    });

    return Array.from(categoryMap.entries()).map(([category, minutes]) => ({
      name: category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      value: Math.round(minutes),
      color: CATEGORY_COLORS[category] || '#6b7280',
    }));
  };

  // Calculate daily average rating
  const getRatingTrendData = () => {
    const dateMap = new Map<string, { total: number; count: number }>();

    sessions.forEach((session) => {
      if (session.rating > 0) {
        const existing = dateMap.get(session.date);
        if (existing) {
          existing.total += session.rating;
          existing.count += 1;
        } else {
          dateMap.set(session.date, { total: session.rating, count: 1 });
        }
      }
    });

    return Array.from(dateMap.entries())
      .map(([date, { total, count }]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rating: parseFloat((total / count).toFixed(1)),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 data points
  };

  const dailyData = getLast30DaysData();
  const categoryData = getCategoryData();
  const ratingData = getRatingTrendData();

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500">
          Log some practice sessions to see charts and trends
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Practice Time Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Practice Time - Last 30 Days
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="minutes" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Time by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Rating Trend */}
        {ratingData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Rating Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
