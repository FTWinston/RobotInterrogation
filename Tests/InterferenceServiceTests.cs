﻿using RobotInterrogation.Services;
using System;
using Xunit;

namespace Tests
{
    public class InterferenceServiceTests
    {
        [Theory]
        [InlineData(1, @"
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
        [InlineData(2, @"
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
        [InlineData(3, @"
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
        public void GeneratePattern(int seed, string expected)
        {
            var random = new Random(seed);
            var service = new InterferenceService();

            var pattern = service.Generate(random, 4, 8, 6);
            Assert.NotNull(pattern);

            var display = pattern.ToString();
            Assert.NotNull(display);
            Assert.Equal(expected.Trim(), display.Trim());
        }
    }
}
