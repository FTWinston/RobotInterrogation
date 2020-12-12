using RobotInterrogation.Services;
using System;
using System.Linq;
using Xunit;

namespace Tests
{
    public class InterferenceServiceTests
    {
        [Theory]
        [InlineData(1, 7, 4, 8)]
        [InlineData(2, 4, 8, 4)]
        [InlineData(3, 7, 4, 6)]

        public void GeneratePattern_ExpectedDimensions(int seed, int width, int height, int numMarkers)
        {
            var random = new Random(seed);
            var service = new InterferenceService();

            var pattern = service.Generate(random, width, height, numMarkers);
            Assert.NotNull(pattern);

            var display = pattern.ToString();
            Assert.NotNull(display);

            var displayLines = display.Split(new string[] { Environment.NewLine }, StringSplitOptions.None);
            Assert.Equal(height * 4 + 2, displayLines.Length);
            Assert.Equal(string.Empty, displayLines.Last());

            foreach (var line in displayLines.Take(displayLines.Length - 1))
            {
                Assert.Equal(width * 4 + 1, line.Length);
            }

            Assert.Equal(numMarkers, pattern.MarkerSequence.Count);
            Assert.Equal(numMarkers, pattern.SolutionSequence.Count);
            Assert.Equal(numMarkers, pattern.Arrows.Count);
        }

        [Theory]
        [InlineData(1, "EFACBD", @"
┌───┬───────────┐
│   │           │
│ │ │ ────┬───┐ │
│↑│ │     │   │ │
│ │ ├──── │ │ │ │
│B│ │     │ │C│ │
│ │ │ ┌───┘ │ │ │
│ │ │ │     │↑│ │
│ │ │ │ ┌───┤ │ │
│ │   │ │A  │ │ │
│ └───┘ │ │ │ │ │
│       │↑│ │ │D│
├───────┘ │ │ │ │
│         │   │↓│
│ ┌───────┴───┘ │
│ │             │
│ │ ────┬───────┤
│ │     │      E│
│ └───┐ │ ┌───┐ │
│     │ │ │   │↓│
├───┐ │ │ │ │ │ │
│   │ │ │ │ │ │ │
│ │ │ │ │ │ │ │ │
│ │ │ │ │ │ │   │
│ │ │ │ │ │ └───┤
│ │ │ │ │ │     │
│ │ │ │ │ └───┐ │
│↑│ │ │ │     │ │
│ │ │ │ └──── │ │
│F│   │       │ │
│ └───┴───────┘ │
│               │
└───────────────┘
        ")]
        [InlineData(2, "BFEDAC", @"
┌───┬───────────┐
│   │           │
│ │ │ ┌───────┐ │
│ │ │ │       │ │
│ │ │ │ ────┐ │ │
│ │ │ │A →  │ │ │
│ │ │ ├───┐ │ │ │
│ │ │ │   │ │   │
│ │ │ │ │ │ └───┤
│ │ │ │ │ │     │
│ │ │ │ │ └───┐ │
│ │ │   │  ← D│ │
│ │ ├───┴───┐ │ │
│ │ │       │ │ │
│ │ │ ┌───┐ │ │ │
│ │E│ │   │ │ │ │
│ │ │ │ │ │ │ │ │
│ │↓│ │ │F│   │ │
│ │ │ │ │ └───┤ │
│ │ │ │ │↑    │↓│
│ │ │ │ ├──── │ │
│ │   │ │     │C│
│ └───┘ │ ┌───┘ │
│       │ │     │
├───────┤ │ ────┤
│  → B  │ │     │
│ ┌──── │ └───┐ │
│ │     │     │ │
│ │ ────┴──── │ │
│ │           │ │
│ └───────────┘ │
│               │
└───────────────┘
        ")]
        [InlineData(3, "CEBADF", @"
┌───────┬───────┐
│       │       │
│ ────┐ │ ────┐ │
│     │↑│     │ │
├───┐ │ └──── │ │
│   │ │A      │ │
│ │ │ └───────┤ │
│ │ │         │ │
│ │ └───┬──── │ │
│ │     │     │↑│
│ ├───┐ │ ┌───┘ │
│ │  D│ │ │    B│
│ │ │ │ │ │ ────┤
│F│ │↓│ │ │     │
│ │ │ │ │ └───┐ │
│↓│ │   │     │ │
│ │ └───┴──── │ │
│ │           │ │
│ ├───────────┘ │
│ │             │
│ │ ────────┬───┤
│ │    ← E  │   │
│ └───────┐ │ │ │
│         │ │ │ │
├──────── │ │ │ │
│         │ │ │ │
│ ┌───────┘ │ │ │
│ │    → C  │ │ │
│ │ ────────┘ │ │
│ │           │ │
│ └───────────┘ │
│               │
└───────────────┘
        ")]
        public void GeneratePattern_SpecificResults(int seed, string expectedSequence, string expectedLayout)
        {
            var random = new Random(seed);
            var service = new InterferenceService();

            var pattern = service.Generate(random, 4, 8, 6);
            Assert.NotNull(pattern);

            var display = pattern.ToString();
            Assert.NotNull(display);

            string actualSequence = string.Join(string.Empty, pattern.SolutionSequence);
            Assert.Equal(expectedSequence, actualSequence);

            Assert.Equal(expectedLayout.Trim(), display.Trim());
        }
    }
}
