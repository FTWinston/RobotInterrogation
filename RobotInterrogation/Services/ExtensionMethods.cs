using System;

namespace RobotInterrogation.Services
{
    public static class ExtensionMethods
    {
        public static T[][] ToJaggedArray<T>(this T[,] twoDimensionalArray)
        {
            return ToJaggedArray<T, T>(twoDimensionalArray, val => val);
        }

        public static TResult[][] ToJaggedArray<TSource, TResult>(this TSource[,] twoDimensionalArray, Func<TSource, TResult> convertValue)
        {
            int rowsFirstIndex = twoDimensionalArray.GetLowerBound(0);
            int rowsLastIndex = twoDimensionalArray.GetUpperBound(0);
            int numberOfRows = rowsLastIndex + 1;

            int columnsFirstIndex = twoDimensionalArray.GetLowerBound(1);
            int columnsLastIndex = twoDimensionalArray.GetUpperBound(1);
            int numberOfColumns = columnsLastIndex + 1;

            TResult[][] jaggedArray = new TResult[numberOfRows][];
            for (int i = rowsFirstIndex; i <= rowsLastIndex; i++)
            {
                jaggedArray[i] = new TResult[numberOfColumns];

                for (int j = columnsFirstIndex; j <= columnsLastIndex; j++)
                {
                    jaggedArray[i][j] = convertValue(twoDimensionalArray[i, j]);
                }
            }
            return jaggedArray;
        }
    }
}
