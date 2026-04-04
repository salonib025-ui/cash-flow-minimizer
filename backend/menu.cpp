#include <bits/stdc++.h>
#include "cashflow.cpp"
using namespace std;

void showMenu() {
    cout << "\n========== CASH FLOW MINIMIZER ==========\n";
    cout << "1. Run New Test Case\n";
    cout << "2. Exit\n";
    cout << "Enter choice: ";
}

int main() {
    int choice;

    do {
        showMenu();
        cin >> choice;

        switch(choice) {
            case 1: {
                int n;
                cout << "\nEnter number of people: ";
                cin >> n;

                if(n <= 1) {
                    cout << "Need at least 2 people.\n";
                    break;
                }

                CashFlow cf(n);
                cf.inputNames();
                cf.inputGraph();
                cf.minimizeCashFlow();
                break;
            }

            case 2:
                cout << "Exiting program...\n";
                break;

            default:
                cout << "Invalid choice! Try again.\n";
        }

    } while(choice != 2);

    return 0;
}