import React, { useEffect, useRef } from 'react';

const CustomDoughnutChart = ({ value, total }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 30; // Adjust the radius as needed
    const startAngle = 0;
    const endAngle = (value / 100) * 2 * Math.PI; // Calculate the end angle based on the percentage

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.lineWidth = 20; // Adjust the line width as needed
    context.strokeStyle = '#7ED957'; // Adjust the background color
    context.stroke();

    // Draw the filled portion
    context.beginPath();
    context.arc(centerX, centerY, radius, startAngle, endAngle);
    context.lineWidth = 20; // Adjust the line width as needed
    context.strokeStyle = '#FF5757'; // Adjust the fill color
    context.stroke();

    // Draw the percentage text
    context.font = '14px Arial'; // Adjust the font size and style
    context.fillStyle = 'black'; // Adjust the text color
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    // Draw the first line
    // context.fillText(`${total}`, centerX, centerY - 10);

    // Draw the second line
    // context.fillText(`Total`, centerX, centerY + 10);
  }, [value]);

  return (
    <div className="custom-doughnut-chart">
      <canvas ref={canvasRef} width={80} height={80} />
    </div>
  );
};

export default CustomDoughnutChart;
