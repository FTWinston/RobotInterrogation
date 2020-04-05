using RobotInterrogation.Models;
using RobotInterrogation.Services;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Tests
{
    public class InterferenceServiceTests
    {
        [Theory]
        [InlineData(1, @"
╖╘╦╗
║╔╝║
╚╝╖║
╔═╩╝
╚╗╔╗
╖║║╙
║║╚╗
╚╩═╝
")]
        [InlineData(2, @"
╖╔═╗
║╠╗╙
║╙╚╗
║╔╗║
║║╚╣
╚╝╔╝
╔╕╚╗
╚══╝
")]
        [InlineData(3, @"
╘╗╘╗
╖╚═╣
╠╗╔╝
║╙╚╗
╠══╝
╚═╗╖
╔═╝║
╚══╝
")]
        public void GenerateSimple(int seed, string expected)
        {
            var random = new Random(seed);
            var service = new InterferenceService();

            var pattern = service.GenerateSimple(random, 4, 8);
            Assert.NotNull(pattern);

            var display = ToString(pattern);
            Assert.NotNull(display);
            Assert.Equal(expected.Trim(), display.Trim());
        }

        [Theory]
        [InlineData(1, @"
╔╗╔════╗
║║╚═╗╔╗║
║║╔═╝║║║
║║║╔═╝║║
║╚╝║╔╗║║
╚══╝║║║║
╔═══╝╚╝║
║╔═════╝
║╚═╗╔══╗
╚═╗║║╔╗║
╔╗║║║║║║
║║║║║║╚╝
║║║║║╚═╗
║║║║╚═╗║
║╚╝╚══╝║
╚══════╝
")]
        [InlineData(2, @"
╔╗╔════╗
║║║╔══╗║
║║║╚═╗║║
║║║╔╗║╚╝
║║║║║╚═╗
║║╚╝╚═╗║
║║╔══╗║║
║║║╔╗║║║
║║║║║╚╝║
║║║║╚═╗║
║╚╝║╔═╝║
╚══╝║╔═╝
╔══╗║╚═╗
║╔═╝╚═╗║
║╚════╝║
╚══════╝
")]
        [InlineData(3, @"
╔══╗╔══╗
╚═╗║╚═╗║
╔╗║╚══╝║
║║╚═══╗║
║╚═╗╔═╝║
║╔╗║║╔═╝
║║║║║╚═╗
║║╚╝╚═╗║
║╚════╝║
║╔═════╝
║╚═══╗╔╗
╚═══╗║║║
╔═══╝║║║
║╔═══╝║║
║╚════╝║
╚══════╝
")]
        public void GenerateDouble(int seed, string expected)
        {
            var random = new Random(seed);
            var service = new InterferenceService();

            var simplePattern = service.GenerateSimple(random, 4, 8);
            Assert.NotNull(simplePattern);

            var doublePattern = service.DoubleUp(simplePattern);
            Assert.NotNull(doublePattern);

            var display = ToString(doublePattern);
            Assert.NotNull(display);
            Assert.Equal(expected.Trim(), display.Trim());
        }

        private string ToString(InterferencePattern pattern)
        {
            var output = new StringBuilder();

            for (int y = 0; y < pattern.Height; y++)
            {
                for (int x = 0; x < pattern.Width; x++)
                {
                    var connections = pattern.Connections[x, y];
                    output.Append(characters[connections]);
                }
                output.AppendLine();
            }

            return output.ToString();
        }

        private Dictionary<InterferencePattern.Direction, char> characters = new Dictionary<InterferencePattern.Direction, char>
        {
            { InterferencePattern.Direction.North, '╙' },
            { InterferencePattern.Direction.South, '╖' },
            { InterferencePattern.Direction.East, '╘' },
            { InterferencePattern.Direction.West, '╕' },

            { InterferencePattern.Direction.North | InterferencePattern.Direction.South, '║' },
            { InterferencePattern.Direction.East | InterferencePattern.Direction.West, '═' },

            { InterferencePattern.Direction.North | InterferencePattern.Direction.West, '╝' },
            { InterferencePattern.Direction.North | InterferencePattern.Direction.East, '╚' },
            { InterferencePattern.Direction.South | InterferencePattern.Direction.West, '╗' },
            { InterferencePattern.Direction.South | InterferencePattern.Direction.East, '╔' },

            { InterferencePattern.Direction.North | InterferencePattern.Direction.South | InterferencePattern.Direction.East, '╠' },
            { InterferencePattern.Direction.North | InterferencePattern.Direction.South | InterferencePattern.Direction.West, '╣' },
            { InterferencePattern.Direction.North | InterferencePattern.Direction.East | InterferencePattern.Direction.West, '╩' },
            { InterferencePattern.Direction.South | InterferencePattern.Direction.East | InterferencePattern.Direction.West, '╦' },

            { InterferencePattern.Direction.North | InterferencePattern.Direction.South | InterferencePattern.Direction.East | InterferencePattern.Direction.West, '╬' },
            { InterferencePattern.Direction.None, ' ' },
        };
    }
}
