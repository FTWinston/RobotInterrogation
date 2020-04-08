using RobotInterrogation.Services;
using System;
using System.Linq;
using Xunit;

namespace Tests
{
    public class InterferenceServiceTests
    {
        [Theory]
        [InlineData(1, "AECFDB", @"
┌───┬───────────┐
│   │           │
│ │ │ ────┬───┐ │
│ │E│A →  │   │ │
│ │ ├──── │ │ │ │
│ │↑│     │ │ │ │
│ │ │ ┌───┘ │ │ │
│ │ │ │     │ │ │
│ │ │ │ ┌───┤ │ │
│ │   │ │   │ │ │
│ └───┘ │ │ │ │ │
│       │ │ │ │ │
├───────┘ │ │ │ │
│         │   │ │
│ ┌───────┴───┘ │
│ │  B →        │
│ │ ────┬───────┤
│ │     │       │
│ └───┐ │ ┌───┐ │
│     │ │ │   │ │
├───┐ │ │ │ │ │ │
│   │ │ │ │ │↓│ │
│ │ │ │ │ │ │ │ │
│ │ │ │ │ │ │D  │
│ │ │ │ │ │ └───┤
│ │↑│ │ │ │     │
│ │ │ │ │ └───┐ │
│↓│C│ │ │     │ │
│ │ │ │ └──── │ │
│F│   │       │ │
│ └───┴───────┘ │
│               │
└───────────────┘
")]
        [InlineData(2, "BEFDAC", @"
┌───┬───────────┐
│   │           │
│ │ │ ┌───────┐ │
│ │ │ │       │ │
│ │ │ │ ────┐ │ │
│ │ │↑│A →  │ │ │
│ │ │ ├───┐ │ │ │
│ │ │D│   │ │   │
│ │ │ │ │ │ └───┤
│ │ │ │ │ │     │
│ │ │ │ │ └───┐ │
│ │ │   │  ← F│ │
│ │ ├───┴───┐ │ │
│ │ │       │ │ │
│ │ │ ┌───┐ │ │ │
│ │ │ │  E│ │ │ │
│ │ │ │ │ │ │ │ │
│ │ │ │ │↑│   │ │
│ │ │ │ │ └───┤ │
│ │ │ │ │     │↓│
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
        [InlineData(3, "DCBAEF", @"
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
│ │  E│ │ │    B│
│ │ │ │ │ │ ────┤
│ │ │↓│ │ │     │
│ │ │ │ │ └───┐ │
│ │ │   │     │ │
│ │ └───┴──── │ │
│ │           │ │
│ ├───────────┘ │
│F│             │
│ │ ────────┬───┤
│↓│         │   │
│ └───────┐ │ │ │
│         │ │ │ │
├──────── │ │ │ │
│         │ │ │ │
│ ┌───────┘ │ │ │
│ │    → C  │ │ │
│ │ ────────┘ │ │
│ │        ← D│ │
│ └───────────┘ │
│               │
└───────────────┘
")]
        public void GeneratePattern(int seed, string expectedSequence, string expectedLayout)
        {
            var random = new Random(seed);
            var service = new InterferenceService();

            var pattern = service.Generate(random);
            Assert.NotNull(pattern);

            var display = pattern.ToString();
            Assert.NotNull(display);
            Assert.Equal(expectedLayout.Trim(), display.Trim());

            string actualSequence = string.Join(string.Empty, pattern.SolutionSequence);

            Assert.Equal(expectedSequence, actualSequence);
        }
    }
}
