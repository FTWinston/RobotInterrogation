using RobotInterrogation.Services;
using System;
using System.Linq;
using Xunit;

namespace Tests
{
    public class InterferenceServiceTests
    {
        [Theory]
        [InlineData(1, "ACBEFD", @"
┌───┬───────────┐
│   │           │
│ │ │ ────┬───┐ │
│ │ │A    │   │ │
│ │ ├──── │ │ │ │
│C│ │     │ │ │ │
│ │ │ ┌───┘ │ │ │
│ │ │ │     │ │ │
│ │ │ │ ┌───┤ │ │
│ │   │ │B  │ │ │
│ └───┘ │ │ │ │ │
│       │ │ │ │ │
├───────┘ │ │ │ │
│         │   │ │
│ ┌───────┴───┘ │
│ │  D          │
│ │ ────┬───────┤
│ │     │       │
│ └───┐ │ ┌───┐ │
│     │ │ │   │ │
├───┐ │ │ │ │ │ │
│   │ │ │ │ │ │ │
│ │ │ │ │ │ │ │ │
│ │ │ │ │ │ │F  │
│ │ │ │ │ │ └───┤
│ │ │ │ │ │     │
│ │ │ │ │ └───┐ │
│ │E│ │ │     │ │
│ │ │ │ └──── │ │
│ │   │       │ │
│ └───┴───────┘ │
│               │
└───────────────┘
")]
        [InlineData(2, "CFEBDA", @"
┌───┬───────────┐
│   │           │
│ │ │ ┌───────┐ │
│ │ │ │       │ │
│ │ │ │ ────┐ │ │
│ │ │ │A    │ │ │
│ │ │ ├───┐ │ │ │
│ │ │D│   │ │   │
│ │ │ │ │ │ └───┤
│ │ │ │ │ │     │
│ │ │ │ │ └───┐ │
│ │ │   │     │ │
│ │ ├───┴───┐ │ │
│B│ │       │ │ │
│ │ │ ┌───┐ │ │ │
│ │ │ │  E│ │ │ │
│ │ │ │ │ │ │ │ │
│ │ │ │ │ │   │ │
│ │ │ │ │ └───┤ │
│ │ │ │ │     │ │
│ │ │ │ ├──── │ │
│ │   │ │     │ │
│ └───┘ │ ┌───┘ │
│       │ │     │
├───────┤ │ ────┤
│      F│ │  C  │
│ ┌──── │ └───┐ │
│ │     │     │ │
│ │ ────┴──── │ │
│ │           │ │
│ └───────────┘ │
│               │
└───────────────┘
")]
        [InlineData(3, "AFCBDE", @"
┌───────┬───────┐
│       │       │
│ ────┐ │ ────┐ │
│     │ │     │ │
├───┐ │ └──── │ │
│   │ │       │ │
│ │ │ └───────┤ │
│ │ │    B    │ │
│ │ └───┬──── │ │
│ │C    │     │ │
│ ├───┐ │ ┌───┘ │
│ │   │ │ │    D│
│ │ │ │ │ │ ────┤
│ │ │ │ │ │     │
│ │ │ │ │ └───┐ │
│ │ │   │     │ │
│ │ └───┴──── │ │
│ │           │ │
│ ├───────────┘ │
│ │             │
│ │ ────────┬───┤
│ │         │   │
│ └───────┐ │ │ │
│         │ │ │ │
├──────── │ │ │ │
│         │ │ │ │
│ ┌───────┘ │ │ │
│F│      E  │ │ │
│ │ ────────┘ │ │
│ │           │ │
│ └───────────┘ │
│              A│
└───────────────┘
")]
        public void GeneratePattern(int seed, string expectedSequence, string expectedLayout)
        {
            var random = new Random(seed);
            var service = new InterferenceService();

            var pattern = service.Generate(random, 4, 8, 6);
            Assert.NotNull(pattern);

            var display = pattern.ToString();
            Assert.NotNull(display);
            Assert.Equal(expectedLayout.Trim(), display.Trim());

            string actualSequence = string.Join
            (
                "",
                pattern.MarkerSequence
                    .Select(i => (char)('A' + i))
            );

            Assert.Equal(expectedSequence, actualSequence);
        }
    }
}
