using System;

public class Math
{
    private int _result;

    public int result {
       get {
           return _result;
       }
    }

    public Math(int startNum) {
        _result = startNum;
    }

    public void add(int num) {
        Console.WriteLine("Adding {0} to {1}", num, _result);
        _result += num;
    }

    public void subtract(int num) {
        Console.WriteLine("Subtracting {0} from {1}", num, _result);
        _result -= num;
    }

    public void multiply(int num) {
        Console.WriteLine("Multiplying {0} with {1}", num, _result);
        _result *= num;
    }

    public void divide(int num) {
        Console.WriteLine("Dividing {0} from {1}", num, _result);
        _result /= num;
    }
}