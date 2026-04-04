#include <bits/stdc++.h>
using namespace std;

class CashFlow {
private:
    int N;
    vector<vector<int>> graph;
    vector<string> names;
    int transactionCount;   // ⭐ counter

public:
    CashFlow(int n) {
        N = n;
        graph.resize(N, vector<int>(N, 0));
        names.resize(N);
        transactionCount = 0;
    }

    void inputNames() {
        cout << "\nEnter names of people:\n";
        for(int i = 0; i < N; i++) {
            cout << "Person " << i << ": ";
            cin >> names[i];
        }
    }

    void inputGraph() {
        cout << "\nEnter transaction matrix:\n";
        cout << "(Amount person i owes person j)\n";

        for(int i = 0; i < N; i++) {
            for(int j = 0; j < N; j++) {
                cin >> graph[i][j];

                if(graph[i][j] < 0) {
                    cout << "Invalid input! Setting to 0.\n";
                    graph[i][j] = 0;
                }
            }
        }
    }

    vector<int> calculateNetAmount() {
        vector<int> net(N, 0);

        for(int p = 0; p < N; p++) {
            for(int i = 0; i < N; i++) {
                net[p] += (graph[i][p] - graph[p][i]);
            }
        }

        return net;
    }

    int getMaxCredit(vector<int>& net) {
        return max_element(net.begin(), net.end()) - net.begin();
    }

    int getMaxDebit(vector<int>& net) {
        return min_element(net.begin(), net.end()) - net.begin();
    }

    void minimizeCashFlowRec(vector<int>& net) {
        int maxCred = getMaxCredit(net);
        int maxDebt = getMaxDebit(net);

        if(net[maxCred] == 0 && net[maxDebt] == 0)
            return;

        int amount = min(-net[maxDebt], net[maxCred]);

        net[maxCred] -= amount;
        net[maxDebt] += amount;

        cout <<names[maxDebt]
             << " pays Rs." << amount
             << " to " << names[maxCred] << endl;

        transactionCount++;   // ⭐ increment counter

        minimizeCashFlowRec(net);
    }

    void minimizeCashFlow() {
        transactionCount = 0;   // reset before each run
        vector<int> net = calculateNetAmount();

        cout << "\nOptimized Transactions:\n";
        minimizeCashFlowRec(net);

        cout << "\n Total Transactions: " << transactionCount << endl;
    }
};

int main() {
    int choice;

    do {
        cout << "\n========== CASH FLOW MINIMIZER ==========\n";
        cout << "1. Run New Test Case\n";
        cout << "2. Exit\n";
        cout << "Enter choice: ";
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