using RobotInterrogation.Models;
using System;
using System.Collections.Generic;

namespace RobotInterrogation.Services
{
    public class InterferenceService
    {
        public InterferencePattern Generate(Random random, int simpleWidth, int simpleHeight)
        {
            var simplePattern = GenerateSimple(random, simpleWidth, simpleHeight);
            var doublePattern = DoubleUp(simplePattern);



            return doublePattern;
        }

        private struct Coord
        {

            public Coord(int x, int y, InterferencePattern.Direction direction, InterferencePattern.Direction opposite)
            {
                Direction = direction;
                OppositeDirection = opposite;
                X = x;
                Y = y;
            }

            public InterferencePattern.Direction Direction { get; }

            public InterferencePattern.Direction OppositeDirection { get; }

            public int X { get; }

            public int Y { get; }
        }

        private List<Coord> CardinalOffsets { get; } = new List<Coord>
        {
            new Coord(1, 0, InterferencePattern.Direction.East, InterferencePattern.Direction.West),
            new Coord(-1, 0, InterferencePattern.Direction.West, InterferencePattern.Direction.East),
            new Coord(0, 1, InterferencePattern.Direction.South, InterferencePattern.Direction.North),
            new Coord(0, -1, InterferencePattern.Direction.North, InterferencePattern.Direction.South),
        };

        private InterferencePattern GenerateSimple(Random random, int width, int height)
        {
            var pattern = new InterferencePattern(width, height);
            GeneratePassagesFrom(0, 0, pattern, random);
            return pattern;
        }

        private void GeneratePassagesFrom(int startX, int startY, InterferencePattern pattern, Random random)
        {
            var directions = new List<Coord>(CardinalOffsets);
            Shuffle(directions, random);

            foreach (var direction in directions)
            {
                int nextX = startX + direction.X;
                if (nextX < 0 || nextX >= pattern.Width)
                    continue;

                int nextY = startY + direction.Y;
                if (nextY < 0 || nextY >= pattern.Height)
                    continue;

                if (pattern.Connections[nextX, nextY] != InterferencePattern.Direction.None)
                    continue;

                pattern.Connections[startX, startY] |= direction.Direction;
                pattern.Connections[nextX, nextY] |= direction.OppositeDirection;

                GeneratePassagesFrom(nextX, nextY, pattern, random);
            }
        }

        private InterferencePattern DoubleUp(InterferencePattern source)
        {
            var result = new InterferencePattern(source.Width * 2, source.Height * 2);

            for (int sourceX = 0; sourceX < source.Width; sourceX++)
                for (int sourceY = 0; sourceY < source.Height; sourceY++)
                {
                    var destX = sourceX * 2;
                    var destY = sourceY * 2;

                    // Expand each source cell into 2x2 cells in the destination, filling the interior walls wherever there's an external connection.
                    var sourceConnections = source.Connections[sourceX, sourceY];

                    bool midNorthOpen = !sourceConnections.HasFlag(InterferencePattern.Direction.North);
                    bool midSouthOpen = !sourceConnections.HasFlag(InterferencePattern.Direction.South);
                    bool midEastOpen = !sourceConnections.HasFlag(InterferencePattern.Direction.East);
                    bool midWestOpen = !sourceConnections.HasFlag(InterferencePattern.Direction.West);

                    var northWest = sourceConnections & (InterferencePattern.Direction.North | InterferencePattern.Direction.West);
                    if (midNorthOpen)
                        northWest |= InterferencePattern.Direction.East;
                    if (midWestOpen)
                        northWest |= InterferencePattern.Direction.South;
                    result.Connections[destX, destY] = northWest;

                    var northEast = sourceConnections & (InterferencePattern.Direction.North | InterferencePattern.Direction.East);
                    if (midNorthOpen)
                        northEast |= InterferencePattern.Direction.West;
                    if (midEastOpen)
                        northEast |= InterferencePattern.Direction.South;
                    result.Connections[destX + 1, destY] = northEast;

                    var southWest = sourceConnections & (InterferencePattern.Direction.South | InterferencePattern.Direction.West);
                    if (midSouthOpen)
                        southWest |= InterferencePattern.Direction.East;
                    if (midWestOpen)
                        southWest |= InterferencePattern.Direction.North;
                    result.Connections[destX, destY + 1] = southWest;

                    var southEast = sourceConnections & (InterferencePattern.Direction.South | InterferencePattern.Direction.East);
                    if (midSouthOpen)
                        southEast |= InterferencePattern.Direction.West;
                    if (midEastOpen)
                        southEast |= InterferencePattern.Direction.North;
                    result.Connections[destX + 1, destY + 1] = southEast;
                }

            return result;
        }

        private void Shuffle<T>(IList<T> list, Random random)
        {
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = random.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }
    }
}
