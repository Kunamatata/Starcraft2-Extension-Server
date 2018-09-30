function measurePerformance(req, res, next) {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    console.log(`Benchmark: ${diff[0]}s ${diff[1] * 1e-6}ms`);
  });
  next();
}

module.exports = measurePerformance;
