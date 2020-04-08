using RobotInterrogation.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace RobotInterrogation.Services
{
    public class InterferenceService
    {
        public InterferencePattern Generate(Random random, int simpleWidth = 4, int simpleHeight = 7, int numMarkers = 6)
        {
            // Generate a simple maze pattern.
            var simplePattern = GenerateSimple(random, simpleWidth, simpleHeight);

            // Convert each cell of the maze into 2x2 cell squares, and add lines down the middle of each squares.
            var pattern = DoubleUp(simplePattern);

            // Place more than the required number of markers, initially.
            List<Point> markerPositions = PlaceMarkers(random, pattern.Width, pattern.Height, numMarkers * 3);

            // Determine the path through the maze.
            var markerData = SolveSequence(random, markerPositions, pattern.Connections);

            // Remove markers from this path that are too close together, leaving us with numMarkers.
            RemoveClosestMarkers(markerData, numMarkers);

            // Save the marker positions, in "display" order.
            pattern.Markers.AddRange
            (
                markerData
                    .OrderBy(step => step.SortOrder)
                    .Select(step => step.Cell)
            );

            // Now save the solution.
            pattern.MarkerSequence.AddRange
            (
                markerData.Select(step => step.SortOrder)
            );

            // For each marker, decide which arrow to keep, and add it to the pattern.
            foreach (var marker in markerData)
            {
                var subsequentCell = marker.SubsequentCell;
                var connections = pattern.Connections[subsequentCell.X, subsequentCell.Y];

                // If there's space to continue in the subsequent direction, use that cell for the arrow.
                // Otherwise use the previous cell, which points at the marker cell.
                if (connections.HasFlag(marker.SubsequentCellDirection))
                    pattern.Arrows.Add(new Tuple<Point, InterferencePattern.Direction>(subsequentCell, marker.SubsequentCellDirection));
                else
                    pattern.Arrows.Add(new Tuple<Point, InterferencePattern.Direction>(marker.PreviousCell, marker.PreviousCellDirection));
            }

            return pattern;
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

        private List<Point> PlaceMarkers(Random random, int width, int height, int numMarkers)
        {
            var results = new List<Point>();

            for (int i = 0; i < numMarkers; i++)
            {
                Point point;

                do
                {
                    point = new Point(random.Next(width), random.Next(height));
                } while (results.Contains(point));

                results.Add(point);
            }

            return results;
        }

        private class SequenceMarker
        {
            public int SortOrder { get; set; }

            public Point Cell { get; set; }
            public int StepsToNextMarker { get; set; }

            public Point PreviousCell { get; set; }
            public Point SubsequentCell { get; set; }

            public InterferencePattern.Direction PreviousCellDirection { get; set; }
            public InterferencePattern.Direction SubsequentCellDirection { get; set; }
        }

        private List<SequenceMarker> SolveSequence(Random random, List<Point> markers, InterferencePattern.Direction[,] connections)
        {
            var directions = new List<Coord>(CardinalOffsets);
            Shuffle(directions, random);

            var results = new List<SequenceMarker>();
            var startPosition = markers.First();
            var currentPosition = startPosition;
            var prevPosition = startPosition;
            var prevDirection = InterferencePattern.Direction.None;

            var stepsToNextMarker = 0;

            SequenceMarker prevMarker = new SequenceMarker
            {
                SortOrder = 0,
                Cell = currentPosition,
            };

            do
            {
                stepsToNextMarker++;

                // Find a direction we can move in that isn't back to where we came from.
                var currentConnections = connections[currentPosition.X, currentPosition.Y];
                var direction = directions.First
                (
                    direction => currentConnections.HasFlag(direction.Direction)
                              && direction.OppositeDirection != prevDirection
                );

                prevPosition = currentPosition;
                currentPosition.Offset(direction.X, direction.Y);
                prevDirection = direction.Direction;

                if (prevMarker.SubsequentCellDirection == InterferencePattern.Direction.None)
                {
                    prevMarker.SubsequentCell = currentPosition;
                    prevMarker.SubsequentCellDirection = prevDirection;
                }

                var markerId = markers.IndexOf(currentPosition);
                if (markerId != -1)
                {
                    var test = markers[markerId];

                    // We've reached a new marker, so add it to the results.
                    prevMarker = new SequenceMarker
                    {
                        SortOrder = markerId,
                        Cell = currentPosition,
                        PreviousCell = prevPosition,
                        PreviousCellDirection = prevDirection,
                    };

                    results.Add(prevMarker);

                    // Update the previous marker with its # steps.
                    prevMarker.StepsToNextMarker = stepsToNextMarker;
                    stepsToNextMarker = 0;
                }
            } while (currentPosition != startPosition);

            var firstStep = results.First();
            firstStep.PreviousCell = prevPosition;
            firstStep.PreviousCellDirection = prevDirection;

            return results;
        }

        private void RemoveClosestMarkers(List<SequenceMarker> markerData, int targetNumMarkers)
        {
            // Remove the marker with the shortest StepsToNextMarker, until we have targetNumMarkers.
            while (markerData.Count > targetNumMarkers)
            {
                int removeIndex = FindMinIndex(markerData, out int removeLength);

                int prevIndex = removeIndex == 0
                    ? markerData.Count - 1
                    : removeIndex - 1;

                // The removed item's "steps to next" gets added onto the previous step.
                markerData[prevIndex].StepsToNextMarker += removeLength;

                var removeMarker = markerData[removeIndex];
                markerData.RemoveAt(removeIndex);
                
                foreach (var step in markerData.Where(step => step.SortOrder > removeMarker.SortOrder))
                    step.SortOrder--;
            }
        }

        private int FindMinIndex(List<SequenceMarker> values, out int minValue)
        {
            int index = 0;
            minValue = int.MaxValue;

            for (int i = 0; i < values.Count; i++)
            {
                var value = values[i].StepsToNextMarker;
                if (value < minValue)
                {
                    index = i;
                    minValue = value;
                }
            }

            return index;
        }
    }
}
